import { AdminService } from "./admin.service";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../utils/response";

export class AdminController {
  constructor(private service: AdminService) {}
}
