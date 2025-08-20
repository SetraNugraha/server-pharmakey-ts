import { PrismaClient } from "@prisma/client";

export class CartModel {
  constructor(private prisma: PrismaClient) {}

  findExistsProduct = async (userId: string, productId: string) => {
    return await this.prisma.carts.findFirst({
      where: { user_id: userId, product_id: productId },
      select: {
        user_id: true,
        product_id: true,
        quantity: true,
      },
    });
  };

  addToCart = async (userId: string, productId: string) => {
    return await this.prisma.carts.upsert({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
      update: {
        quantity: { increment: 1 },
      },
      create: {
        user_id: userId,
        product_id: productId,
        quantity: 1,
      },
    });
  };
}
