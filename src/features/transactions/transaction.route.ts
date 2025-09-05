import { prisma } from "../../config/database";
import { HttpMethod, IRouting } from "../../interface/routing.interface";
import { verifyAdmin, verifyCustomer, verifyToken } from "../../middlewares/auth.middleware";
import { uploadProofTransactionsImage } from "../../middlewares/uploadImage.middleware";
import { zodValidation } from "../../middlewares/zodValidation.middleware";
import { TransactionModule } from "./transaction.module";
import { CheckoutBodySchema } from "./transaction.schema";

const { controller } = TransactionModule(prisma);

export const TransactionRoutes: IRouting[] = [
  // ALL TRANSACTIONS
  {
    method: HttpMethod.GET,
    url: "/transactions",
    middleware: [verifyToken, verifyAdmin],
    controller: controller.getAllTransactions,
  },
  // TRANSACTION BY CUSTOMER
  {
    method: HttpMethod.GET,
    url: "/transactions/customer",
    middleware: [verifyToken, verifyCustomer],
    controller: controller.getTransactionsByCustomerId,
  },
  // CHECKOUT - CUSTOMER
  {
    method: HttpMethod.POST,
    url: "/transaction/checkout",
    middleware: [verifyToken, verifyCustomer, zodValidation(CheckoutBodySchema)],
    controller: controller.checkout,
  },
  // UPLOAD PROOF - CUSTOMER
  {
    method: HttpMethod.PUT,
    url: "/transaction/upload-proof/:transactionId",
    middleware: [verifyToken, verifyCustomer, uploadProofTransactionsImage.single("proof")],
    controller: controller.uploadProof,
  },
  // UPDATE IS PAID - ADMIN
  {
    method: HttpMethod.PUT,
    url: "/transaction/:transactionId/is-paid/:newStatus",
    middleware: [verifyToken, verifyAdmin],
    controller: controller.updateIsPaid,
  },
];
