import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { successResponse } from "../../utils/response";
import { deleteImageCloudinary } from "../../utils/deleteImageCloudinary";

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
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 7;
      const search = req.query.search as string;
      const data = await this.service.getProductByFilter(page, limit, search);

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
    const image_url = req.file?.path || null;
    const image_public_id = req.file?.filename || null;

    try {
      const data = await this.service.createProduct({
        ...req.body,
        image_url,
        image_public_id,
      });
      successResponse(res, 201, "create product success", data);
    } catch (error) {
      // If Error delete image in cloudinary
      if (image_public_id) {
        await deleteImageCloudinary(image_public_id);
      }

      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const image_url = req.file?.path || null;
    const image_public_id = req.file?.filename || null;

    try {
      const productId = String(req.params.productId);
      const data = await this.service.updateProduct({ ...req.body, id: productId, image_url, image_public_id });
      successResponse(res, 200, "update product success", data);
    } catch (error) {
      // If Error delete image in cloudinary
      if (image_public_id) {
        await deleteImageCloudinary(image_public_id);
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
