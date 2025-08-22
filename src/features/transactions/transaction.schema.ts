import { z } from "zod";
import { IsPaid, PaymentMethod } from "@prisma/client";

interface CustomerTransaction {
  username: string;
  email: string;
  profile_image: string | null;
}

interface TransactionAddress {
  address: string;
  city: string;
  post_code: number;
  phone_number: string;
}

export interface GetTransactionDto {
  id: string;
  is_paid: IsPaid;
  proof: string | null;
  customer: CustomerTransaction;
  billing: CheckoutPricingDto;
  shipping: TransactionAddress;
  transaction_detail: TransactionDetailDto[];
}

export interface TransactionDetailDto {
  transaction_id: string;
  product_id: string;
  price: number;
  quantity: number;
}

export interface CheckoutPricingDto {
  sub_total: number;
  tax: number;
  delivery_fee: number;
  total_amount: number;
}

export const CheckoutBodySchema = z.object({
  address: z.string({ message: "address is required" }),
  city: z.string({ message: "city is required" }),
  post_code: z
    .number({ message: "post code is required" })
    .int({ message: "post code must be an integer" })
    .refine((val) => /^\d{5}$/.test(String(val)), {
      message: "post code must be 5 digits",
    }),
  phone_number: z
    .string({ message: "phone number is required" })
    .regex(/^\d+$/, { message: "phone number should contain only digits" })
    .min(11, { message: "phone number should be at least 11 digits" })
    .max(12, { message: "phone number should be at most 12 digits" }),
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

export interface CheckoutTransactionDto extends CheckoutPricingDto, CheckoutBodyDto {
  is_paid: IsPaid;
  proof: string | null;
}
