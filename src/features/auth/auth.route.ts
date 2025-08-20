import { prisma } from "../../config/database";
import { IRouting, HttpMethod } from "../../interface/routing.interface";
import { zodValidation } from "../../middlewares/zodValidation.middleware";
import { RegisterSchema, LoginSchema } from "./auth.schema";
import { AuthModule } from "./auth.module";

const { controller } = AuthModule(prisma);

export const AuthRoutes: IRouting[] = [
  // Register Customer
  {
    method: HttpMethod.POST,
    url: "/auth/register",
    middleware: [zodValidation(RegisterSchema)],
    controller: controller.register,
  },
  // Login Customer
  {
    method: HttpMethod.POST,
    url: "/auth/login-customer",
    middleware: [zodValidation(LoginSchema)],
    controller: controller.loginCustomer,
  },
  // Login Admin
  {
    method: HttpMethod.POST,
    url: "/auth/login-admin",
    middleware: [zodValidation(LoginSchema)],
    controller: controller.loginAdmin,
  },
  // Logout
  {
    method: HttpMethod.PUT,
    url: "/auth/logout",
    controller: controller.logout,
  },
  // Resfresh Token
  {
    method: HttpMethod.POST,
    url: "/auth/refresh-token",
    controller: controller.refreshToken,
  },
];
