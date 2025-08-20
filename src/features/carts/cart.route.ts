import { prisma } from "../../config/database";
import { HttpMethod, IRouting } from "../../interface/routing.interface";
import { CartController } from "./cart.controller";
import { CartModel } from "./cart.model";
import { CartService } from "./cart.service";

const model = new CartModel(prisma);
const service = new CartService(model);
const controller = new CartController(service);

export const CartRoutes: IRouting[] = [
  {
    method: HttpMethod.GET,
    url: "/cart",
    controller: () => {
      console.log("get cart oke");
    },
  },
];
