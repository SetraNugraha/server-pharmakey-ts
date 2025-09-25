import { successResponse } from "../../utils/response";
import { CategoryService } from "./category.service";
import { Request, Response, NextFunction } from "express";
import { deleteImageCloudinary } from "../../utils/deleteImageCloudinary";

export class CategoryController {
  constructor(private service: CategoryService) {}

  getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);

      const data = await this.service.getAllCategory(page, limit);
      successResponse(res, 200, "get all category success", data);
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const image_url = req.file?.path || null; // Cloudinary URL
    const image_public_id = req.file?.filename || null; // Cloudinary public ID
    try {
      const name = req.body.name;

      const data = await this.service.createCategory({ name, image_url, image_public_id });
      successResponse(res, 201, "create category success", data);
    } catch (error) {
      if (image_public_id) {
        await deleteImageCloudinary(image_public_id);
      }

      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const image_url = req.file?.path || null; // Cloudinary URL
    const image_public_id = req.file?.filename || null; // Cloudinary public ID

    try {
      const categoryId = String(req.params.categoryId);
      const name = req.body.name;

      const data = await this.service.updateCategory({ id: categoryId, name, image_url, image_public_id });

      successResponse(res, 200, "update category success", data);
    } catch (error) {
      if (image_public_id) {
        await deleteImageCloudinary(image_public_id);
      }

      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = String(req.params.categoryId);
      await this.service.deleteCategory(categoryId);

      successResponse(res, 200, "delete category success");
    } catch (error) {
      next(error);
    }
  };
}
