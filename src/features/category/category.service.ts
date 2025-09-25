import { keyof, ZodError } from "zod";
import generateSlug from "../../utils/generateSlug";
import { CategoryModel } from "./category.model";
import { AppError } from "../../middlewares/error.middleware";
import { deleteImageCloudinary } from "../../utils/deleteImageCloudinary";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.schema";
import cloudinary from "../../config/cloudinary";

export class CategoryService {
  constructor(private model: CategoryModel) {}

  getAllCategory = async (page: number, limit: number) => {
    const data = await this.model.getAllCategory(page, limit);
    return data;
  };

  createCategory = async (payload: CreateCategoryDto) => {
    const { name, image_url, image_public_id } = payload;
    const sanitizedName = name.trim();
    const newSlug = generateSlug(sanitizedName);

    const existsCategory = await this.model.getCategoryBySlug(newSlug);
    if (existsCategory) {
      throw new ZodError([
        {
          code: "custom",
          path: ["name"],
          message: "name already exists",
        },
      ]);
    }

    const preparePayload = {
      name: sanitizedName,
      image_url,
      image_public_id,
    };

    const data = await this.model.createCategory({ payload: preparePayload, slug: newSlug });

    return data;
  };

  updateCategory = async (payload: UpdateCategoryDto) => {
    if (!payload.id) {
      throw new AppError("category id required", 404);
    }

    const existsCategory = await this.model.getCategoryById(payload.id);
    if (!existsCategory) {
      throw new AppError("category not found", 404);
    }

    const { name, image_url = null, image_public_id = null } = payload;

    // Find Exist name by slug
    let newSlug: string | undefined;
    let sanitizedName: string | undefined;
    if (name) {
      sanitizedName = name?.trim();
      newSlug = generateSlug(sanitizedName);

      const findExistsName = await this.model.getCategoryBySlug(newSlug);
      if (findExistsName?.slug === newSlug) {
        throw new ZodError([
          {
            code: "custom",
            path: ["name"],
            message: "name already exists",
          },
        ]);
      }
    }

    const newPayload = {
      id: existsCategory.id,
      name: sanitizedName ?? existsCategory.name,
      image_url: image_url ?? existsCategory.image_url,
      image_public_id: image_public_id ?? existsCategory.image_public_id,
    };

    const isChanges = Object.entries(newPayload).some(
      ([key, value]) => value !== undefined && value !== existsCategory[key as keyof typeof existsCategory]
    );

    if (!isChanges) {
      throw new AppError("no fields are changes", 404);
    }

    // Delete Old Image
    if (image_url && existsCategory.image_public_id) {
      await deleteImageCloudinary(existsCategory.image_public_id);
    }

    return await this.model.updateCategory({ payload: newPayload, slug: newSlug ?? existsCategory.slug });
  };

  deleteCategory = async (categoryId: string) => {
    if (!categoryId.trim()) {
      throw new AppError("category id required", 400);
    }

    const existsCategory = await this.model.getCategoryById(categoryId);
    if (!existsCategory) {
      throw new AppError("category not found", 404);
    }

    // Delete image from cloudinary
    if (existsCategory.image_public_id) {
      await deleteImageCloudinary(existsCategory.image_public_id);
    }

    return await this.model.deleteCategory(categoryId);
  };
}
