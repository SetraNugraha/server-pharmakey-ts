import { prisma } from "../../config/database";
import { HttpMethod, IRouting } from "../../interface/routing.interface";
import { verifyAdmin, verifyToken } from "../../middlewares/auth.middleware";
import { uploadCategoryImage } from "../../middlewares/uploadImage.middleware";
import { zodValidation } from "../../middlewares/zodValidation.middleware";
import { CreateCategorySchema, UpdateCategorySchema } from "./category.schema";
import { CategoryModule } from "./category.module";

const { controller } = CategoryModule(prisma);

export const CategoryRoutes: IRouting[] = [
  // GET Category
  {
    method: HttpMethod.GET,
    url: "/category",
    controller: controller.getAllCategory,
  },
  // CREATE Category
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
