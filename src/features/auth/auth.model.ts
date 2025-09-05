import { PrismaClient } from "@prisma/client";
import { RegisterDto } from "./auth.schema";

export class AuthModel {
  private readonly select = {
    id: true,
    username: true,
    email: true,
    password: true,
    role: true,
    profile_image: true,
    address: true,
    city: true,
    post_code: true,
    phone_number: true,
  };
  constructor(private prisma: PrismaClient) {}

  getUserByEmail = async (email: string) => {
    return await this.prisma.users.findUnique({
      where: { email },
      select: this.select,
    });
  };

  getUserByToken = async (refreshToken: string) => {
    return await this.prisma.users.findFirst({
      where: { refresh_token: refreshToken },
      select: this.select,
    });
  };

  register = async (payload: RegisterDto) => {
    const { username, email, password, role } = payload;
    const data = await this.prisma.users.create({
      data: {
        username,
        email,
        password,
        role: role,
      },
      select: this.select,
    });

    return data;
  };

  deleteRefreshToken = async (userId: string) => {
    return await this.prisma.users.update({
      where: { id: userId },
      data: { refresh_token: null },
    });
  };
}
