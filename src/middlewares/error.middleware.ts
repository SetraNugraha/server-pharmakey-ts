import { Request, Response, NextFunction } from "express";
import multer from "multer";
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
  // ZOD
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

  // MULTER
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "validation error",
        errors: [
          {
            field: err.field,
            message: "file too large, maximun allowed size is 5MB",
          },
        ],
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "validation error",
        errors: [
          {
            field: err.field,
            message: "invalid file type, only JPG, JPEG and PNG are allowed",
          },
        ],
      });
    }
  }

  if (err instanceof AppError) {
    console.error(`[${req.method}] ${req.url} - ${err.message}`);

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(`[${req.method}] ${req.url} - unexpected error: ${JSON.stringify(err, null, 2)}`);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
