import { prisma } from "../../config/database";
import { IRouting, HttpMethod } from "../../interface/routing.interface";
import { CustomerController } from "./customer.controller";
import { CustomerModel } from "./customer.model";
import { CustomerService } from "./customer.service";

const model = new CustomerModel(prisma);
const service = new CustomerService(model);
const controller = new CustomerController(service);

export const CustomerRoutes: IRouting[] = [
  {
    method: HttpMethod.GET,
    url: "/customers",
    controller: controller.getAllCustomer,
  },
];
