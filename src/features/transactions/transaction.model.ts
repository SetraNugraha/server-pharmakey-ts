import { PrismaClient } from "@prisma/client";
import { TransactionDetailDto, CheckoutTransactionDto, GetTransactionDto } from "./transaction.schema";

export class TransactionModel {
  constructor(private prisma: PrismaClient) {}

  getTransactions = async (customerId?: string): Promise<GetTransactionDto[]> => {
    const data = await this.prisma.transactions.findMany({
      where: customerId ? { user_id: customerId } : {},
      select: {
        id: true,
        is_paid: true,
        proof: true,
        sub_total: true,
        tax: true,
        delivery_fee: true,
        total_amount: true,
        address: true,
        city: true,
        post_code: true,
        phone_number: true,
        notes: true,
        user: {
          select: {
            username: true,
            email: true,
            profile_image: true,
          },
        },
        transaction_detail: {
          select: {
            transaction_id: true,
            product_id: true,
            price: true,
            quantity: true,
          },
        },
      },
    });

    const formattedData = data.map(
      ({ user, sub_total, tax, delivery_fee, total_amount, address, city, post_code, phone_number, ...rest }) => ({
        ...rest,
        customer: user,
        billing: { sub_total, tax, delivery_fee, total_amount },
        shipping: { address, city, post_code, phone_number },
      })
    );

    return formattedData;
  };

  // GET All Transaction
  getAllTransactions = async (): Promise<GetTransactionDto[]> => {
    return await this.getTransactions();
  };

  // GET Transaction By Customer Id
  getTransactionByCustomerId = async (customerId: string): Promise<GetTransactionDto[]> => {
    return await this.getTransactions(customerId);
  };

  // CREATE Transactions
  checkout = async (customerId: string, payload: CheckoutTransactionDto) => {
    return await this.prisma.transactions.create({
      data: {
        user_id: customerId,
        ...payload,
      },
    });
  };

  // CREATE Transactions Detail after checkout success
  createTransactionDetail = async (payload: TransactionDetailDto[]) => {
    return await this.prisma.transaction_Details.createMany({
      data: payload,
    });
  };

  // UPLOAD proof

  // UPDATE status is_paid
}
