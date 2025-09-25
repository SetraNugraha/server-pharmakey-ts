import { PrismaClient } from "@prisma/client";
import { IGetCustomerDto, UpdateCustomerDto } from "./customer.schema";
import { IMetadata } from "../../interface/metadata.interface";

export class CustomerModel {
  private readonly select = {
    id: true,
    username: true,
    email: true,
    password: true,
    role: true,
    image_url: true,
    image_public_id: true,
    address: true,
    city: true,
    post_code: true,
    phone_number: true,
  };

  constructor(private prisma: PrismaClient) {}

  getAllCustomers = async (page: number, limit: number): Promise<{ customers: IGetCustomerDto[]; meta: IMetadata }> => {
    const offset = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.users.count({ where: { role: "CUSTOMER" } }),
      this.prisma.users.findMany({
        where: { role: "CUSTOMER" },
        skip: offset,
        take: limit,
        orderBy: { created_at: "desc" },
        select: this.select,
      }),
    ]);

    const isPrev = page > 1;
    const isNext = offset + limit < total;

    return {
      customers: data,
      meta: { isPrev, isNext, total, page, limit },
    };
  };

  getCustomerById = async (customerId: string): Promise<IGetCustomerDto | null> => {
    const data = await this.prisma.users.findUnique({
      where: { id: customerId, role: "CUSTOMER" },
      select: this.select,
    });

    return data;
  };

  getCustomerByEmail = async (email: string): Promise<IGetCustomerDto | null> => {
    const data = await this.prisma.users.findUnique({
      where: { email, role: "CUSTOMER" },
      select: this.select,
    });

    return data;
  };

  getCustomerByToken = async (token: string): Promise<IGetCustomerDto | null> => {
    return await this.prisma.users.findFirst({
      where: { refresh_token: token, role: "CUSTOMER" },
      select: this.select,
    });
  };

  updateCustomer = async (customerId: string, payload: UpdateCustomerDto) => {
    return await this.prisma.users.update({
      where: { id: customerId, role: "CUSTOMER" },
      data: payload,
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

  deleteCustomer = async (customerId: string) => {
    return await this.prisma.users.delete({
      where: { id: customerId, role: "CUSTOMER" },
    });
  };
}
