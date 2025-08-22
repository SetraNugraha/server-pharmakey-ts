import { prisma } from "../../config/database";
import { HttpMethod, IRouting } from "../../interface/routing.interface";
import { verifyAdmin, verifyCustomer, verifyToken } from "../../middlewares/auth.middleware";
import { zodValidation } from "../../middlewares/zodValidation.middleware";
import { TransactionModule } from "./transaction.module";
import { CheckoutBodySchema } from "./transaction.schema";

const { controller } = TransactionModule(prisma);

export const TransactionRoutes: IRouting[] = [
  {
    method: HttpMethod.GET,
    url: "/transactions",
    middleware: [verifyToken, verifyAdmin],
    controller: controller.getAllTransactions,
  },
  {
    method: HttpMethod.GET,
    url: "/transactions/customer",
    middleware: [verifyToken, verifyCustomer],
    controller: controller.getTransactionsByCustomerId,
  },
  {
    method: HttpMethod.POST,
    url: "/transaction/checkout",
    middleware: [verifyToken, verifyCustomer, zodValidation(CheckoutBodySchema)],
    controller: controller.checkout,
  },
];
