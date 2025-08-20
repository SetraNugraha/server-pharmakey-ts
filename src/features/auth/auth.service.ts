import { ZodError } from "zod";
import { CustomerModel } from "../customer/customer.model";
import { AuthModel } from "./auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../middlewares/error.middleware";
import { RegisterDto, LoginDto } from "./auth.schema";

export class AuthService {
  constructor(private model: AuthModel, private customerModel: CustomerModel) {}

  register = async (payload: RegisterDto) => {
    const { username, email, role, password, confirmPassword } = payload;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sanitizedPayload = {
      username: username.trim(),
      email: email.toLowerCase().trim(),
      role: role,
      password: hashedPassword,
      confirmPassword,
    };

    const existsEmail = await this.model.getUserByEmail(sanitizedPayload.email);

    if (existsEmail) {
      throw new ZodError([
        {
          code: "custom",
          path: ["email"],
          message: "email already exists",
        },
      ]);
    }

    const result = await this.model.register(sanitizedPayload);

    return result;
  };

  login = async (body: LoginDto) => {
    const existsUser = await this.model.getUserByEmail(body.email);
    if (!existsUser) {
      throw new ZodError([
        {
          code: "custom",
          path: ["email"],
          message: "email not register yet",
        },
      ]);
    }

    const matchPassword = await bcrypt.compare(body.password, existsUser.password);
    if (!matchPassword) {
      throw new ZodError([
        {
          code: "custom",
          path: ["password"],
          message: "passowrd do not match",
        },
      ]);
    }

    if (!["ADMIN", "CUSTOMER"].includes(existsUser.role)) {
      throw new AppError("Invalid role, role must be ADMIN or CUSTOMER", 401);
    }

    const { id: userId, email, username, role } = existsUser;
    const payload = {
      userId,
      email,
      username,
      role,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "15m", // expired 15 min
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: "1d", // expired 1 day
    });

    await this.customerModel.updateRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken, role };
  };

  logout = async (refreshToken: string) => {
    if (!refreshToken || refreshToken === "") {
      throw new AppError("Unauthorized, token not provided", 401); // 401 = Unauthorized
    }

    const existsUser = await this.customerModel.getCustomerByToken(refreshToken);
    if (!existsUser) {
      throw new AppError("Forbidden, invalid or expired token", 403); // 403 = Forbidden
    }

    // delete refreshToken on db
    await this.customerModel.deleteRefreshToken(existsUser.id);
  };

  refreshToken = async (refreshToken: string) => {
    if (!refreshToken || refreshToken === "") {
      throw new AppError("Unauthorized, token not provided", 401);
    }

    const existsUser = await this.model.getUserByToken(refreshToken);
    if (!existsUser) {
      throw new AppError("Forbidden, invalid or expired token", 403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err, decode) => {
      if (err) {
        throw new AppError("Forbidden, invalid or expired token", 403);
      }
    });

    const { id: userId, email, username, role } = existsUser;

    const payload = { userId, email, username, role };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "15m",
    });

    return accessToken;
  };
}
