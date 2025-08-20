import { PrismaClient } from "@prisma/client";
import { AuthModel } from "./auth.model";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CustomerModel } from "../customer/customer.model";

export const AuthModule = (prisma: PrismaClient) => {
  // MODEL
  const authModel = new AuthModel(prisma);
  const customerModel = new CustomerModel(prisma);

  // SERVICE
  const authService = new AuthService(authModel, customerModel);

  // CONTROLLER
  const controller = new AuthController(authService);

  return { controller };
};
