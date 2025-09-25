import { IsPaid } from "@prisma/client";
import { successResponse } from "../../utils/response";
import { TransactionService } from "./transaction.service";
import { Request, Response, NextFunction } from "express";
import { deleteImageCloudinary } from "../../utils/deleteImageCloudinary";

export class TransactionController {
  constructor(private service: TransactionService) {}

  getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const statusQuery = req.query.status as IsPaid | undefined;
      let proofUploadQuery: boolean | undefined;

      if (req.query.proofUpload === "true") {
        proofUploadQuery = true;
      } else if (req.query.proofUpload === "false") {
        proofUploadQuery = false;
      } else {
        proofUploadQuery = undefined;
      }

      const data = await this.service.getAllTransaction(page, limit, { status: statusQuery, proofUpload: proofUploadQuery });
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
    const proof_url = req?.file?.path;
    const proof_public_id = req?.file?.filename;

    try {
      const customerId = req.user!.userId;
      const transactionId = req.params.transactionId;

      const data = await this.service.uploadProof({ transactionId, customerId, proof_url, proof_public_id });
      successResponse(res, 200, "upload proof success", data);
    } catch (error) {
      if (proof_public_id) {
        await deleteImageCloudinary(proof_public_id);
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
