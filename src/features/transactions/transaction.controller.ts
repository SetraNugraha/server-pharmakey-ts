import { IsPaid } from "@prisma/client";
import { successResponse } from "../../utils/response";
import { TransactionService } from "./transaction.service";
import { Request, Response, NextFunction } from "express";

export class TransactionController {
  constructor(private service: TransactionService) {}

  getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAllTransaction();
      successResponse(res, 200, "get all transactions success", data);
    } catch (error) {
      next(error);
    }
  };

  getTransactionsByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.userId;
      const data = await this.service.getTransactionsByCustomerId(customerId);
      successResponse(res, 200, "get transactions by customer id success", data);
    } catch (error) {
      next(error);
    }
  };

  checkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.userId;
      const data = await this.service.checkout(customerId, req.body);
      successResponse(res, 200, "checkout success", data);
    } catch (error) {
      next(error);
    }
  };

  uploadProof = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.userId;
      const transactionId = req.params.transactionId;
      const imageProof = req.file!.filename;

      const data = await this.service.uploadProof(transactionId, customerId, imageProof);

      successResponse(res, 200, "upload proof success", data);
    } catch (error) {
      next(error);
    }
  };

  updateIsPaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactionId = req.params.transactionId;
      const newStatus = req.params.newStatus;
      const sanitizedNewStatus = newStatus.trim().toUpperCase() as IsPaid;

      const data = await this.service.updateIsPaid(transactionId, sanitizedNewStatus);

      successResponse(res, 200, "update paid status success", data);
    } catch (error) {
      next(error);
    }
  };
}
