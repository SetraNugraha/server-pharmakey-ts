import { NextFunction, Request, Response } from "express";
import { CustomerService } from "./customer.service";
import { successResponse } from "../../utils/response";

export class CustomerController {
  constructor(private service: CustomerService) {}

  getAllCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAllCustomer();
      successResponse(res, 200, "getAllCustomer success", data);
    } catch (error) {
      next(error);
    }
  };
}
