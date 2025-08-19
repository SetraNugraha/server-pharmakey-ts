import { prisma } from "../../config/database";
import { HttpMethod, IRouting } from "../../interface/routing.interface";
import { verifyAdmin, verifyToken } from "../../middlewares/auth.middleware";
import { zodValidation } from "../../middlewares/zodValidation.middleware";
import { CategoryModel } from "../category/category.model";
import { CreateProductSchema } from "./dto/create-product.dto";
import { ProductController } from "./product.controller";
import { ProductModel } from "./product.model";
import { ProductService } from "./product.service";

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
    middleware: [verifyToken, verifyAdmin, zodValidation(CreateProductSchema)],
    controller: controller.createProduct,
  },
];
