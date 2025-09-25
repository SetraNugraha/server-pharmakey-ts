import { ZodError } from "zod";
import generateSlug from "../../utils/generateSlug";
import { CategoryModel } from "../category/category.model";
import { ProductModel } from "./product.model";
import { AppError } from "../../middlewares/error.middleware";
import { CreateProductDto, UpdateProductDto } from "./product.schema";
import { deleteImageCloudinary } from "../../utils/deleteImageCloudinary";

export class ProductService {
  constructor(private model: ProductModel, private categoryModel: CategoryModel) {}

  getAllProducts = async (page: number, limit: number) => {
    const data = await this.model.getAllProducts(page, limit);
    return data;
  };

  getProductByFilter = async (page: number, limit: number, search?: string) => {
    const data = await this.model.getProductByFilter(page, limit, search);
    return data;
  };

  getProductBySlug = async (slug: string) => {
    if (!slug) {
      throw new AppError("product id required", 404);
    }

    const product = await this.model.getProductBySlug(slug);
    if (!product) {
      throw new AppError("product not found", 404);
    }

    return product;
  };

  createProduct = async (payload: CreateProductDto) => {
    const existsCategory = await this.categoryModel.getCategoryById(payload.category_id);
    const slug = generateSlug(payload.name);
    const existsProduct = await this.model.getProductBySlug(slug);

    if (!existsCategory) {
      throw new ZodError([
        {
          code: "custom",
          path: ["category"],
          message: "category not found",
        },
      ]);
    }

    if (existsProduct) {
      throw new ZodError([
        {
          code: "custom",
          path: ["name"],
          message: "name already exists",
        },
      ]);
    }

    const data = await this.model.createProduct({ payload, slug });

    return data;
  };

  updateProduct = async (payload: UpdateProductDto) => {
    if (!payload.id) {
      throw new AppError("product id not found", 404);
    }

    // Find Exists Product
    const product = await this.model.getProductById(payload.id);
    if (!product) {
      throw new AppError("product not found", 404);
    }

    // Handle Exists Name
    let newSlug: string | undefined;
    if (payload.name) {
      newSlug = generateSlug(payload.name);
      const existsSlug = await this.model.getProductBySlug(newSlug);
      if (existsSlug?.slug === newSlug) {
        throw new ZodError([
          {
            code: "custom",
            path: ["name"],
            message: "name already exists",
          },
        ]);
      }
    }

    // Delete Old Image
    if (payload.image_public_id && product.image_public_id) {
      await deleteImageCloudinary(product.image_public_id);
    }

    const newPayload = {
      id: product.id,
      name: payload.name ?? product.name,
      category_id: payload.category_id ?? product.category_id,
      price: payload.price ? Number(payload.price) : product.price,
      image_url: payload.image_url ?? product.image_url,
      image_public_id: payload.image_public_id ?? product.image_public_id,
      description: payload.description ?? product.description,
    };

    // some() return boolean => for check are some field change or not
    const isChanges = Object.entries(newPayload).some(([key, val]) => val !== undefined && val !== product[key as keyof typeof product]);

    if (!isChanges) {
      throw new AppError("no fields are changes", 404);
    }

    return await this.model.updateProduct({
      payload: newPayload,
      slug: payload.name ? newSlug : product.slug,
    });
  };

  deleteProduct = async (productId: string) => {
    if (!productId) {
      throw new AppError("product id not found", 404);
    }

    const existsProduct = await this.model.getProductById(productId);
    if (!existsProduct) {
      throw new AppError("product not found", 404);
    }

    // Delete Old Image
    if (existsProduct.image_public_id) {
      await deleteImageCloudinary(existsProduct.image_public_id);
    }

    return await this.model.deleteProduct(existsProduct.id);
  };
}
