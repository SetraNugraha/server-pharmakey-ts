import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { successResponse } from "../../utils/response";
import { RegisterDto, LoginDto } from "./auth.schema";
import { AppError } from "../../middlewares/error.middleware";

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as RegisterDto;
      const result = await this.service.register(body);
      successResponse(res, 201, "register success", result);
    } catch (error) {
      next(error);
    }
  };

  loginCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as LoginDto;
      const result = await this.service.login(body);

      if (result.role !== "CUSTOMER") {
        throw new AppError("Access Denied, Customer only", 401);
      }

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // Hour * minute * second * mili second = 1 Day
      });

      successResponse(res, 200, "login success", result.accessToken);
    } catch (error) {
      next(error);
    }
  };

  loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as LoginDto;
      const result = await this.service.login(body);

      if (result.role !== "ADMIN") {
        throw new AppError("Access Denied, Admin only", 401);
      }

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // Hour * minute * second * mili second = 1 Day
      });

      successResponse(res, 200, "login success", result.accessToken);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      await this.service.logout(refreshToken);
      res.clearCookie("refreshToken");
      successResponse(res, 200, "logout success");
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const result = await this.service.refreshToken(refreshToken);
      successResponse(res, 200, "refreshToken success", result);
    } catch (error) {
      next(error);
    }
  };
}
