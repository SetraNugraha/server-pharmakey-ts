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
}
