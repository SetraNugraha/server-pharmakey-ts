import { prisma } from "../../config/database";
import { HttpMethod, IRouting } from "../../interface/routing.interface";
import { verifyAdmin, verifyToken } from "../../middlewares/auth.middleware";
import { zodValidation } from "../../middlewares/zodValidation.middleware";
import { CategoryModel } from "../category/category.model";
import { CreateProductSchema, UpdateProductSchema } from "./product.schema";
import { ProductController } from "./product.controller";
import { ProductModel } from "./product.model";
import { ProductService } from "./product.service";
import { uploadProductsImage } from "../../middlewares/uploadImage.middleware";

const model = new ProductModel(prisma);
const categoryModel = new CategoryModel(prisma);
const service = new ProductService(model, categoryModel);
const controller = new ProductController(service);

export const ProductRoutes: IRouting[] = [
  {
    method: HttpMethod.GET,
    url: "/products",
    middleware: [verifyToken],
    controller: controller.getAllProducts,
  },
  {
    method: HttpMethod.POST,
    url: "/product/create",
    middleware: [
      verifyToken,
      verifyAdmin,
      uploadProductsImage.single("product_image"),
      zodValidation(CreateProductSchema),
    ],
    controller: controller.createProduct,
  },
  {
    method: HttpMethod.PATCH,
    url: "/product/update/:productId",
    middleware: [
      verifyToken,
      verifyAdmin,
      uploadProductsImage.single("product_image"),
      zodValidation(UpdateProductSchema),
    ],
    controller: controller.updateProduct,
  },
  {
    method: HttpMethod.DELETE,
    url: "/product/delete/:productId",
    middleware: [verifyToken, verifyAdmin],
    controller: controller.deleteProduct,
  },
];
