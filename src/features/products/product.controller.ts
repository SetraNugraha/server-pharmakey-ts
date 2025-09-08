import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { successResponse } from "../../utils/response";
import { unlinkImage } from "../../utils/unlinkImage";

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

  getProductByFilter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, category } = req.query as { name?: string; category?: string };
      const data = await this.service.getProductByFilter(name, category);

      successResponse(res, 200, "get product by filter success", data);
    } catch (error) {
      next(error);
    }
  };

  getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug;
      const data = await this.service.getProductBySlug(slug);
      successResponse(res, 200, "get product by slug success", data);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productImage = req.file ? req.file.filename : null;
    try {
      const data = await this.service.createProduct({
        ...req.body,
        product_image: productImage,
      });
      successResponse(res, 201, "create product success", data);
    } catch (error) {
      if (productImage) {
        unlinkImage("products", productImage);
      }
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productImage = req.file ? req.file.filename : null;

    try {
      const productId = String(req.params.productId);
      const data = await this.service.updateProduct(productId, { ...req.body, product_image: productImage });
      successResponse(res, 200, "update product success", data);
    } catch (error) {
      if (productImage) {
        unlinkImage("products", productImage);
      }
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = String(req.params.productId);
      await this.service.deleteProduct(productId);
      successResponse(res, 200, "delete product success");
    } catch (error) {
      next(error);
    }
  };
}
