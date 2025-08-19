import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { successResponse } from "../../utils/response";

export class ProductController {
  constructor(private service: ProductService) {}

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const data = await this.service.getAllProducts(page, limit);

      successResponse(res, 200, "get all products success", data);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.createProduct(req.body);
      successResponse(res, 201, "create product success", data);
    } catch (error) {
      next(error);
    }
  };
}
