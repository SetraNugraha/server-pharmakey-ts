import { prisma } from "../../config/database";
import { HttpMethod, IRouting } from "../../interface/routing.interface";
import { verifyAdmin, verifyToken } from "../../middlewares/auth.middleware";
import { uploadCategoryImage } from "../../middlewares/uploadImage.middleware";
import { zodValidation } from "../../middlewares/zodValidation.middleware";
import { CategoryController } from "./category.controller";
import { CategoryModel } from "./category.model";
import { CategoryService } from "./category.service";
import { CreateCategorySchema } from "./dto/create-category.dto";
import { UpdateCategorySchema } from "./dto/update-category.dto";

const model = new CategoryModel(prisma);
const service = new CategoryService(model);
const controller = new CategoryController(service);

export const CategoryRoutes: IRouting[] = [
  // GET Category
  {
    method: HttpMethod.GET,
    url: "/category",
    middleware: [verifyToken],
    controller: controller.getAllCategory,
  },
  // CRETE Category
  {
    method: HttpMethod.POST,
    url: "/category/create",
    middleware: [
      verifyToken,
      verifyAdmin,
      uploadCategoryImage.single("category_image"),
      zodValidation(CreateCategorySchema),
    ],
    controller: controller.createCategory,
  },
  // UPDATE Category
  {
    method: HttpMethod.PATCH,
    url: "/category/update/:categoryId",
    middleware: [
      verifyToken,
      verifyAdmin,
      uploadCategoryImage.single("category_image"),
      zodValidation(UpdateCategorySchema),
    ],
    controller: controller.updateCategory,
  },
  // DELETE Category
  {
    method: HttpMethod.DELETE,
    url: "/category/delete/:categoryId",
    middleware: [verifyToken, verifyAdmin],
    controller: controller.deleteCategory,
  },
];
