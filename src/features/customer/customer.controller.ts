import { NextFunction, Request, Response } from "express";
import { CustomerService } from "./customer.service";
import { successResponse } from "../../utils/response";
import { deleteImageCloudinary } from "../../utils/deleteImageCloudinary";

export class CustomerController {
  constructor(private service: CustomerService) {}

  getAllCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const data = await this.service.getAllCustomer(page, limit);
      successResponse(res, 200, "getAllCustomer success", data);
    } catch (error) {
      next(error);
    }
  };

  getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.userId;
      const data = await this.service.getCustomerById(customerId);
      successResponse(res, 200, "get customer by id success", data);
    } catch (error) {
      next(error);
    }
  };

  updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const image_url = req?.file?.path || null;
    const image_public_id = req?.file?.filename || null;

    try {
      const customerId = req.user!.userId;
      const data = await this.service.updateCustomer(customerId, { ...req.body, image_url, image_public_id });
      successResponse(res, 200, "update customer success", data);
    } catch (error) {
      if (image_public_id) {
        await deleteImageCloudinary(image_public_id);
      }

      next(error);
    }
  };

  deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.params.customerId;
      await this.service.deleteCustomer(customerId);
      successResponse(res, 200, "customer delete success");
    } catch (error) {
      next(error);
    }
  };
}
