import { PrismaClient } from "@prisma/client";
import { TransactionModel } from "./transaction.model";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { CartModel } from "../carts/cart.model";
import { CustomerModel } from "../customer/customer.model";

export const TransactionModule = (prisma: PrismaClient) => {
  // MODEL
  const transactionModel = new TransactionModel(prisma);
  const cartModel = new CartModel(prisma);
  const customerModel = new CustomerModel(prisma);

  //   SERVICE
  const transactionService = new TransactionService(transactionModel, cartModel, customerModel);

  // CONTROLLER
  const controller = new TransactionController(transactionService);

  return { controller };
};
