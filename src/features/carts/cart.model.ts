import { PrismaClient } from "@prisma/client";
import { CustomerCarts } from "./cart.schema";

export class CartModel {
  constructor(private prisma: PrismaClient) {}

  getCartByCustomerId = async (customerId: string) => {
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
                category_id: true,
                product_image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return { customer_id: customerId, ...data };
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

  addToCart = async (customerId: string, productId: string) => {
    return await this.prisma.carts.upsert({
      where: {
        // This is because 2 row never cant duplicate
        user_id_product_id: {
          user_id: customerId,
          product_id: productId,
        },
      },
      update: {
        quantity: { increment: 1 },
      },
      create: {
        user_id: customerId,
        product_id: productId,
        quantity: 1,
      },
    });
  };

  removeFromCart = async (customerId: string, productId: string) => {
    const customerCarts = await this.findExistsCarts(customerId, productId);

    if (customerCarts!.quantity > 1) {
      return await this.prisma.carts.update({
        where: {
          user_id_product_id: {
            user_id: customerId,
            product_id: productId,
          },
        },
        data: {
          quantity: { decrement: 1 },
        },
      });
    } else {
      return await this.prisma.carts.delete({
        where: {
          user_id_product_id: {
            user_id: customerId,
            product_id: productId,
          },
        },
      });
    }
  };
}
