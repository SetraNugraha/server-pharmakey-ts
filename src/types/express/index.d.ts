import { JwtPayload } from "jsonwebtoken";
import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        username: string;
        role: Role;
      };
    }
  }
}
