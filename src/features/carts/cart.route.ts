import { prisma } from "../../config/database";
import { HttpMethod, IRouting } from "../../interface/routing.interface";
import { verifyCustomer, verifyToken } from "../../middlewares/auth.middleware";
import { CartModule } from "./cart.module";

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
    middleware: [verifyToken, verifyCustomer],
    controller: controller.addToCart,
  },
  {
    method: HttpMethod.POST,
    url: "/cart/remove/product/:productId",
    middleware: [verifyToken, verifyCustomer],
    controller: controller.removeFromcart,
  },
];
