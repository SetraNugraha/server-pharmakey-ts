import { PrismaClient } from "@prisma/client";
import { CartModel } from "./cart.model";
import { CustomerModel } from "../customer/customer.model";
import { ProductModel } from "../products/product.model";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";

export const CartModule = (prisma: PrismaClient) => {
  // MODEL
  const cartModel = new CartModel(prisma);
  const customerModel = new CustomerModel(prisma);
  const productModel = new ProductModel(prisma);

  //   SERVICE
  const cartService = new CartService(cartModel, customerModel, productModel);

  // CONTROLLER
  const controller = new CartController(cartService);

  return { controller };
};
