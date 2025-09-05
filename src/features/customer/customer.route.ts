import { prisma } from "../../config/database";
import { IRouting, HttpMethod } from "../../interface/routing.interface";
import { verifyAdmin, verifyCustomer, verifyToken } from "../../middlewares/auth.middleware";
import { uploadCustomersImage } from "../../middlewares/uploadImage.middleware";
import { zodValidation } from "../../middlewares/zodValidation.middleware";
import { CustomerModule } from "./customer.module";
import { UpdateCustomerSchema } from "./customer.schema";

const { controller } = CustomerModule(prisma);

export const CustomerRoutes: IRouting[] = [
  // GET ALL
  {
    method: HttpMethod.GET,
    url: "/customers",
    controller: controller.getAllCustomer,
  },
  // GET BY ID
  {
    method: HttpMethod.GET,
    url: "/customer/:customerId",
    middleware: [verifyToken, verifyCustomer],
    controller: controller.getCustomerById,
  },
  // UPDATE
  {
    method: HttpMethod.PATCH,
    url: "/customer/update",
    middleware: [
      verifyToken,
      verifyCustomer,
      uploadCustomersImage.single("profile_image"),
      zodValidation(UpdateCustomerSchema),
    ],
    controller: controller.updateCustomer,
  },
  // DELETE
  {
    method: HttpMethod.DELETE,
    url: "/customer/delete/:customerId",
    middleware: [verifyToken, verifyAdmin],
    controller: controller.deleteCustomer,
  },
];
