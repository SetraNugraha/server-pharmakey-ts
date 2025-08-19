import { ZodError } from "zod";
import generateSlug from "../../utils/generateSlug";
import { CategoryModel } from "../category/category.model";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductModel } from "./product.model";

export class ProductService {
  constructor(private model: ProductModel, private categoryModel: CategoryModel) {}

  getAllProducts = async (page: number, limit: number) => {
    const data = await this.model.getAllProducts(page, limit);
    return data;
  };

  createProduct = async (payload: CreateProductDto) => {
    const existsCategory = await this.categoryModel.getCategoryById(payload.category_id);

    if (!existsCategory) {
      throw new ZodError([
        {
          code: "custom",
          path: ["category"],
          message: "category not found",
        },
      ]);
    }

    const slug = generateSlug(payload.name);

    const data = await this.model.createProduct({ ...payload, slug });

    return data;
  };
}
