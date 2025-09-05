import { ZodError } from "zod";
import generateSlug from "../../utils/generateSlug";
import { CategoryModel } from "./category.model";
import { AppError } from "../../middlewares/error.middleware";
import { unlinkImage } from "../../utils/unlinkImage";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.schema";

export class CategoryService {
  constructor(private model: CategoryModel) {}

  getAllCategory = async (page: number, limit: number) => {
    const data = await this.model.getAllCategory(page, limit);
    return data;
  };

  createCategory = async (payload: CreateCategoryDto) => {
    const { name, category_image } = payload;
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
      slug: newSlug,
      category_image: category_image || null,
    };

    const data = await this.model.createCategory(preparePayload);

    return data;
  };

  updateCategory = async (categoryId: string, payload: UpdateCategoryDto) => {
    if (!categoryId?.trim()) {
      unlinkImage("categories", payload.category_image);
      throw new AppError("category id required", 400);
    }

    const existsCategory = await this.model.getCategoryById(categoryId);
    if (!existsCategory) {
      throw new AppError("category not found", 404);
    }

    const { name, category_image = null } = payload;

    let newSlug: string | undefined;
    let sanitizedName: string | undefined;
    if (name) {
      sanitizedName = name?.trim();
      newSlug = generateSlug(sanitizedName);
    }

    if (existsCategory.name === sanitizedName) {
      throw new ZodError([
        {
          code: "custom",
          path: ["name"],
          message: "name already exists",
        },
      ]);
    }

    const preparePayload = {
      name: sanitizedName ?? existsCategory.name,
      slug: newSlug ?? existsCategory.slug,
      category_image: category_image ?? existsCategory.category_image,
    };

    // Unlink old image if exists
    if (category_image && existsCategory.category_image) {
      unlinkImage("categories", existsCategory.category_image);
    }

    return await this.model.updateCategory(existsCategory.id, preparePayload);
  };

  deleteCategory = async (categoryId: string) => {
    if (!categoryId.trim()) {
      throw new AppError("category id required", 400);
    }

    const existsCategory = await this.model.getCategoryById(categoryId);
    if (!existsCategory) {
      throw new AppError("category not found", 404);
    }

    // Unlink old image if exists
    if (existsCategory.category_image) {
      unlinkImage("categories", existsCategory.category_image);
    }

    return await this.model.deleteCategory(categoryId);
  };
}
