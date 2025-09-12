import { z } from "zod";
import { IsPaid, PaymentMethod } from "@prisma/client";

interface CheckoutCustomer {
  username: string;
  email: string;
  profile_image: string | null;
}

interface CheckoutShipping {
  address: string;
  city: string;
  post_code: string;
  phone_number: string;
}

export interface GetTransactionDto {
  id: string;
  is_paid: IsPaid;
  proof: string | null;
  totalItemPurchase: number;
  created_at: string | Date;
  updated_at: string | Date;
  customer: CheckoutCustomer;
  billing: CheckoutBilling;
  shipping: CheckoutShipping;
  transaction_detail: TransactionDetailDto[];
}

export interface TransactionDetailDto {
  quantity: number;
  price: number;
  product: {
    name: string;
    product_image: string | File | null;
  };
}

export interface CreateTransactionDetail {
  transaction_id: string;
  product_id: string;
  price: number;
  quantity: number;
}

export interface CheckoutBilling {
  sub_total: number;
  tax: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: PaymentMethod;
}

export const CheckoutBodySchema = z.object({
  address: z.string({ message: "address is required" }).min(1, { message: "address required" }),
  city: z.string({ message: "city is required" }).min(1, { message: "city is required" }),
  post_code: z
    .string()
    .min(1, { message: "post code is required" })
    .max(5, { message: "post code should be 5 number" }),
  phone_number: z
    .string()
    .min(11, { message: "phone number should be at least 11 digits" })
    .max(12, { message: "phone number should be at most 12 digits" })
    .regex(/^\d+$/, { message: "phone number should contain only digits" }),
  payment_method: z
    .string()
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(PaymentMethod, { message: "Invalid payment method, payment must be TRANSFER or COD" })),
  notes: z
    .string()
    .max(100, { message: "max notes length is 100 characters" })
    .optional()
    .nullable()
    .transform((val) => (!val || val.trim() === "" ? null : val)),
});

export type CheckoutBodyDto = z.infer<typeof CheckoutBodySchema>;

export interface CheckoutTransactionDto extends CheckoutBilling, CheckoutBodyDto {
  is_paid: IsPaid;
  proof: string | null;
}
