import { IsPaid } from "@prisma/client";
import { successResponse } from "../../utils/response";
import { TransactionService } from "./transaction.service";
import { Request, Response, NextFunction } from "express";
import { unlinkImage } from "../../utils/unlinkImage";

export class TransactionController {
  constructor(private service: TransactionService) {}

  getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const data = await this.service.getAllTransaction(page, limit);
      successResponse(res, 200, "get all transactions success", data);
    } catch (error) {
      next(error);
    }
  };

  getTransactionByTransactionId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactionId = req.params.transactionId;
      const data = await this.service.getTransactionByTransactionId(transactionId);
      successResponse(res, 200, "get transaction by id success", data);
    } catch (error) {
      next(error);
    }
  };

  getTransactionsByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      const data = await this.service.getTransactionsByCustomerId(page, limit, customerId);
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
    const imageProof = req.file!.filename;

    try {
      const customerId = req.user!.userId;
      const transactionId = req.params.transactionId;

      const data = await this.service.uploadProof(transactionId, customerId, imageProof);
      successResponse(res, 200, "upload proof success", data);
    } catch (error) {
      if (imageProof) {
        unlinkImage("proofTransactions", imageProof);
      }
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
