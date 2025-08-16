import { prisma } from "../../config/database";
import { IRouting, HttpMethod } from "../../interface/routing.interface";
import { AuthController } from "./auth.controller";
import { AuthModel } from "./auth.model";
import { AuthService } from "./auth.service";
import { CustomerModel } from "../customer/customer.model";
import { zodValidation } from "../../middlewares/zodValidation.middleware";
import { RegisterSchema } from "./dto/register.dto";
import { LoginSchema } from "./dto/login.dto";
import { verifyAdmin, verifyCustomer, verifyToken } from "../../middlewares/auth.middleware";

const model = new AuthModel(prisma);
const customerModel = new CustomerModel(prisma);
const service = new AuthService(model, customerModel);
const controller = new AuthController(service);

export const AuthRoutes: IRouting[] = [
  {
    method: HttpMethod.GET,
    url: "/auth",
    controller: () => {
      console.log("get auth");
    },
  },
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
