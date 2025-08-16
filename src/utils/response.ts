import { Response } from "express";
import { ISuccessResponse } from "../interface/response.interface";

export function successResponse(
  res: Response,
  statusCode: number = 200,
  message: string = "success",
  data?: any
): ISuccessResponse {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
