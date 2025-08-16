import { PrismaClient } from "@prisma/client";
import { GetCustomerDto } from "./dto/get-customer-dto";

export class CustomerModel {
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

  getAllCustomers = async (): Promise<GetCustomerDto[]> => {
    const data = await this.prisma.users.findMany({
      where: { role: "CUSTOMER" },
      select: this.select,
    });

    return data || [];
  };

  getCustomerByEmail = async (email: string): Promise<GetCustomerDto | null> => {
    const data = await this.prisma.users.findUnique({
      where: { email, role: "CUSTOMER" },
      select: this.select,
    });

    return data;
  };

  getCustomerByToken = async (token: string): Promise<GetCustomerDto | null> => {
    return await this.prisma.users.findFirst({
      where: { refresh_token: token, role: "CUSTOMER" },
      select: this.select,
    });
  };

  updateRefreshToken = async (userId: string, token: string) => {
    return await this.prisma.users.update({
      where: { id: userId },
      data: {
        refresh_token: token,
      },
    });
  };

  deleteRefreshToken = async (userId: string) => {
    return await this.prisma.users.update({
      where: { id: userId },
      data: { refresh_token: null },
    });
  };
}
