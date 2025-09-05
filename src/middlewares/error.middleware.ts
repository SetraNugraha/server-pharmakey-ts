import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorMiddleware(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    console.error(`[${req.method}] ${req.url} - Validation error`);
    return res.status(400).json({
      success: false,
      message: "validation error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof AppError) {
    console.error(`[${req.method}] ${req.url} - ${err.message}`);

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(`[${req.method}] ${req.url} - unexpected error: ${err}`);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
