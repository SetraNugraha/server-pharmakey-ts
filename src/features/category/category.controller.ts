import { successResponse } from "../../utils/response";
import { unlinkImage } from "../../utils/unlinkImage";
import { CategoryService } from "./category.service";
import { Request, Response, NextFunction } from "express";

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
    const category_image = req.file ? req.file.filename : null;

    try {
      const name = req.body.name;
      const data = await this.service.createCategory({ name, category_image });
      successResponse(res, 201, "create category success", data);
    } catch (error) {
      if (category_image) {
        unlinkImage("categories", category_image);
      }

      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const category_image = req.file ? req.file.filename : null;

    try {
      const categoryId = String(req.params.categoryId);
      const name = req.body.name;
      const data = await this.service.updateCategory(categoryId, { name, category_image });

      successResponse(res, 200, "update category success", data);
    } catch (error) {
      if (category_image) {
        unlinkImage("categories", category_image);
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
