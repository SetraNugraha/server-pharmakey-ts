import { NextFunction, Request, Response } from "express";
import { CartService } from "./cart.service";
import { successResponse } from "../../utils/response";

export class CartController {
  constructor(private service: CartService) {}

  getCartByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.userId;
      const data = await this.service.getCartByCustomerId(customerId);
      successResponse(res, 200, "get cart by customer success", data);
    } catch (error) {
      next(error);
    }
  };

  addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.userId;
      const productId = req.params.productId;
      const quantity = Number(req.body.quantity);

      const data = await this.service.addToCart(customerId, productId, quantity);
      successResponse(res, 200, "add to cart success", data);
    } catch (error) {
      next(error);
    }
  };

  removeFromcart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = req.user!.userId;
      const productId = req.params.productId;
      const data = await this.service.removeFromCart(customerId, productId);
      successResponse(res, 200, "remove from cart success", data);
    } catch (error) {
      next(error);
    }
  };
}
