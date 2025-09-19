import { IsPaid, PrismaClient, Transactions } from "@prisma/client";
import { CheckoutTransactionDto, GetTransactionDto, CreateTransactionDetail, GetTransactionParam } from "./transaction.schema";
import { IMetadata } from "../../interface/metadata.interface";

export class TransactionModel {
  constructor(private prisma: PrismaClient) {}

  getTransactions = async ({
    page,
    limit,
    transactionId,
    customerId,
    filter,
  }: GetTransactionParam): Promise<{ transactions: GetTransactionDto[]; meta: IMetadata }> => {
    const where: any = {};

    if (transactionId) where.id = transactionId;
    if (customerId) where.user_id = customerId;

    // Filtered Transactions
    if (filter) {
      if (filter.status) {
        where.is_paid = { equals: filter.status as IsPaid };
      }

      if (filter.proofUpload === true) {
        where.proof = { not: null };
      } else if (filter.proofUpload === false) {
        where.proof = { equals: null };
      }
    }

    // Pagination
    const offset = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.transactions.count({ where }),
      this.prisma.transactions.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          is_paid: true,
          payment_method: true,
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
          created_at: true,
          updated_at: true,
          user: {
            select: {
              username: true,
              email: true,
              profile_image: true,
            },
          },
          transaction_detail: {
            select: {
              quantity: true,
              price: true,
              product: {
                select: {
                  name: true,
                  product_image: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const formattedData = data.map(
      ({
        user,
        transaction_detail,
        sub_total,
        tax,
        delivery_fee,
        total_amount,
        payment_method,
        address,
        city,
        post_code,
        phone_number,
        ...rest
      }) => ({
        ...rest,
        totalItemPurchase: transaction_detail.reduce((total, item) => total + item.quantity, 0),
        transaction_detail,
        customer: user,
        billing: { sub_total, tax, delivery_fee, total_amount, payment_method },
        shipping: { address, city, post_code, phone_number },
      })
    );

    const isPrev = page > 1;
    const isNext = offset + limit < total;

    return { transactions: formattedData, meta: { isPrev, isNext, total, page, limit } };
  };

  // GET All Transaction
  getAllTransactions = async (
    page: number,
    limit: number,
    filter?: { status?: IsPaid; proofUpload?: boolean }
  ): Promise<{ transactions: GetTransactionDto[]; meta: IMetadata }> => {
    return await this.getTransactions({ page, limit, filter });
  };

  getTransactionByTransactionId = async (transactionId: string): Promise<Transactions | null> => {
    return await this.prisma.transactions.findUnique({
      where: { id: transactionId },
    });
  };

  // GET Transaction By Customer Id
  getTransactionByCustomerId = async (
    page: number,
    limit: number,
    customerId: string
  ): Promise<{ transactions: GetTransactionDto[]; meta: IMetadata }> => {
    return await this.getTransactions({ page, limit, customerId });
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
  createTransactionDetail = async (payload: CreateTransactionDetail[]) => {
    return await this.prisma.transaction_Details.createMany({
      data: payload,
    });
  };

  // UPLOAD proof
  uploadProof = async (transactionId: string, customerId: string, imageProof: string) => {
    return await this.prisma.transactions.update({
      where: { id: transactionId, user_id: customerId },
      data: {
        proof: imageProof,
      },
    });
  };

  // UPDATE status is_paid SUCCESS or CANCELLED
  updateIsPaid = async (transactionId: string, newStatus: IsPaid) => {
    return await this.prisma.transactions.update({
      where: { id: transactionId },
      data: {
        is_paid: newStatus,
      },
    });
  };

  // DELETE Row Transactions_detail if is_paid CANCELLED
  deleteTransactionDetailByTransactionId = async (transactionId: string) => {
    return await this.prisma.transaction_Details.deleteMany({
      where: { transaction_id: transactionId },
    });
  };
}
