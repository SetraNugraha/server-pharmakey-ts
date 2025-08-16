import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const zodValidation = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
};
