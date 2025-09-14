import { AdminService } from "./admin.service";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../utils/response";

export class AdminController {
  constructor(private service: AdminService) {}

  dashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.dashboard();
      successResponse(res, 200, "get dahsboard data success", data);
    } catch (error) {
      next(error);
    }
  };
}
