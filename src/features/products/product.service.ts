import { ZodError } from "zod";
import generateSlug from "../../utils/generateSlug";
import { CategoryModel } from "../category/category.model";
import { ProductModel } from "./product.model";
import { AppError } from "../../middlewares/error.middleware";
import { CreateProductDto, UpdateProductDto } from "./product.schema";
import { unlinkImage } from "../../utils/unlinkImage";
export class ProductService {
  constructor(private model: ProductModel, private categoryModel: CategoryModel) {}

  getAllProducts = async (page: number, limit: number) => {
    const data = await this.model.getAllProducts(page, limit);
    return data;
  };

  createProduct = async (payload: CreateProductDto) => {
    const existsCategory = await this.categoryModel.getCategoryById(payload.category_id);
    const slug = generateSlug(payload.name);
    const existsProduct = await this.model.getProductBySlug(slug);

    if (!existsCategory) {
      unlinkImage("products", payload.product_image);
      throw new ZodError([
        {
          code: "custom",
          path: ["category"],
          message: "category not found",
        },
      ]);
    }

    if (existsProduct) {
      unlinkImage("products", payload.product_image);
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

  updateProduct = async (productId: string, payload: UpdateProductDto) => {
    if (!productId) {
      unlinkImage("products", payload.product_image);
      throw new AppError("product id not found", 404);
    }

    const existsProduct = await this.model.getProductById(productId);
    if (!existsProduct) {
      unlinkImage("products", payload.product_image);
      throw new AppError("product not found", 404);
    }

    let newSlug: string | undefined;
    if (payload.name) {
      newSlug = generateSlug(payload.name);
      if (existsProduct.slug === newSlug) {
        unlinkImage("products", payload.product_image);
        throw new ZodError([
          {
            code: "custom",
            path: ["name"],
            message: "name already exists",
          },
        ]);
      }
    }

    if (payload.product_image && existsProduct.product_image) {
      unlinkImage("products", existsProduct.product_image);
    }

    const newPayload = {
      name: payload.name ?? existsProduct.name,
      category_id: payload.category_id ?? existsProduct.category_id,
      price: payload.price ?? existsProduct.price,
      product_image: payload.product_image ?? existsProduct.product_image,
      description: payload.description ?? existsProduct.description,
    };

    return await this.model.updateProduct(existsProduct.id, {
      payload: newPayload,
      slug: newSlug ?? existsProduct.slug,
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

    if (existsProduct.product_image) {
      unlinkImage("products", existsProduct.product_image);
    }

    return await this.model.deleteProduct(existsProduct.id);
  };
}
