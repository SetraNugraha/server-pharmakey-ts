import { PrismaClient } from "@prisma/client";
import { AddToCartDto, CustomerCartsDto } from "./cart.schema";

export class CartModel {
  constructor(private prisma: PrismaClient) {}

  getCartByCustomerId = async (customerId: string): Promise<CustomerCartsDto> => {
    const data = await this.prisma.users.findUnique({
      where: { id: customerId, role: "CUSTOMER" },
      select: {
        username: true,
        email: true,
        profile_image: true,
        cart: {
          select: {
            product_id: true,
            quantity: true,
            product: {
              select: {
                name: true,
                slug: true,
                category_id: true,
                product_image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return { customer_id: customerId, ...data! };
  };

  findExistsCarts = async (customerId: string, productId: string) => {
    return await this.prisma.carts.findUnique({
      where: {
        // This is because 2 row never cant duplicate
        user_id_product_id: {
          user_id: customerId,
          product_id: productId,
        },
      },
      select: {
        user_id: true,
        product_id: true,
        quantity: true,
      },
    });
  };

  addToCart = async (customerId: string, productId: string, quantity: number = 1): Promise<AddToCartDto> => {
    return await this.prisma.carts.upsert({
      where: {
        // This is because 2 row never cant duplicate
        user_id_product_id: {
          user_id: customerId,
          product_id: productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        user_id: customerId,
        product_id: productId,
        quantity: quantity,
      },
    });
  };

  removeFromCart = async (customerId: string, productId: string) => {
    await this.prisma.carts.delete({
      where: {
        user_id_product_id: {
          user_id: customerId,
          product_id: productId,
        },
      },
    });
  };

  removeAllItems = async (customerId: string) => {
    return await this.prisma.carts.deleteMany({
      where: { user_id: customerId },
    });
  };
}
