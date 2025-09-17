import { prisma } from "../../config/database";
import { HttpMethod, IRouting } from "../../interface/routing.interface";
import { verifyCustomer, verifyToken } from "../../middlewares/auth.middleware";
import { zodValidation } from "../../middlewares/zodValidation.middleware";
import { CartModule } from "./cart.module";
import { AddToCartSchema } from "./cart.schema";

const { controller } = CartModule(prisma);

export const CartRoutes: IRouting[] = [
  {
    method: HttpMethod.GET,
    url: "/cart/customer",
    middleware: [verifyToken, verifyCustomer],
    controller: controller.getCartByCustomerId,
  },
  {
    method: HttpMethod.POST,
    url: "/cart/add/product/:productId",
    middleware: [verifyToken, verifyCustomer, zodValidation(AddToCartSchema)],
    controller: controller.addToCart,
  },
  {
    method: HttpMethod.POST,
    url: "/cart/remove/product/:productId",
    middleware: [verifyToken, verifyCustomer],
    controller: controller.removeFromcart,
  },
];
