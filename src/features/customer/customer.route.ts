import { prisma } from "../../config/database";
import { IRouting, HttpMethod } from "../../interface/routing.interface";
import { CustomerModule } from "./customer.module";

const { controller } = CustomerModule(prisma);

export const CustomerRoutes: IRouting[] = [
  {
    method: HttpMethod.GET,
    url: "/customers",
    controller: controller.getAllCustomer,
  },
];
