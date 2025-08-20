import { PrismaClient } from "@prisma/client";
import { ProductModel } from "./product.model";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { CategoryModel } from "../category/category.model";
import { CategoryModule } from "../category/category.module";

export const ProductModule = (prisma: PrismaClient) => {
  // MODEL
  const productModel = new ProductModel(prisma);
  const categoryModel = new CategoryModel(prisma);

  // SERVICE
  const productService = new ProductService(productModel, categoryModel);

  // CONTROLLER
  const controller = new ProductController(productService);

  return { controller };
};
