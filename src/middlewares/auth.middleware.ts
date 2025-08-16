import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "@prisma/client";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Unauthorized, token not provided", 401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decode) => {
    if (err) {
      throw new AppError("Forbidden, invalid or expired token", 403);
    }

    const payload = decode as JwtPayload & {
      userId: string;
      email: string;
      username: string;
      role: Role;
    };

    req.user = {
      userId: payload?.userId,
      email: payload?.email,
      username: payload?.username,
      role: payload?.role,
    };

    next();
  });
};

export const verifyCustomer = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;

  if (role !== "CUSTOMER") {
    throw new AppError("Access denied, customer only", 401);
  }

  next();
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;

  if (role !== "ADMIN") {
    throw new AppError("Access denied, admin only", 401);
  }

  next();
};
