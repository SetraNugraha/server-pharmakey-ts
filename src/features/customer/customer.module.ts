import { PrismaClient } from "@prisma/client";
import { CustomerModel } from "./customer.model";
import { CustomerService } from "./customer.service";
import { CustomerController } from "./customer.controller";

export const CustomerModule = (prisma: PrismaClient) => {
  // MODEL
  const customerModel = new CustomerModel(prisma);

  // SERVICE
  const customerService = new CustomerService(customerModel);

  // CONTROLLER
  const controller = new CustomerController(customerService);

  return { controller };
};
