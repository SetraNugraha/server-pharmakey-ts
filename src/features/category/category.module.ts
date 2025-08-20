import { PrismaClient } from "@prisma/client";
import { CategoryModel } from "./category.model";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";

export const CategoryModule = (prisma: PrismaClient) => {
  // MODEL
  const categoryModel = new CategoryModel(prisma);

  // SERVICE
  const categoryService = new CategoryService(categoryModel);

  // CONTROLLER
  const controller = new CategoryController(categoryService);

  return { controller };
};
