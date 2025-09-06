import { keyof, ZodError } from "zod";
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

  updateProduct = async (productId: string, payload: UpdateProductDto) => {
    if (!productId) {
      throw new AppError("product id not found", 404);
    }

    // Find Exists Product
    const product = await this.model.getProductById(productId);
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

    // Unlink Old Image
    if (payload.product_image && product.product_image) {
      unlinkImage("products", product.product_image);
    }

    const newPayload = {
      name: payload.name ?? product.name,
      category_id: payload.category_id ?? product.category_id,
      price: payload.price ? Number(payload.price) : product.price,
      product_image: payload.product_image ?? product.product_image,
      description: payload.description ?? product.description,
    };

    // some() return boolean
    const isChanges = Object.entries(newPayload).some(
      ([key, val]) => val !== undefined && val !== product[key as keyof typeof product]
    );

    if (!isChanges) {
      throw new AppError("no fields are changes", 404);
    }

    return await this.model.updateProduct(product.id, {
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

    if (existsProduct.product_image) {
      unlinkImage("products", existsProduct.product_image);
    }

    return await this.model.deleteProduct(existsProduct.id);
  };
}
