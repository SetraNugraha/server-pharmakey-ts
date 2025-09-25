import { z } from "zod";
import { IsPaid, PaymentMethod } from "@prisma/client";

export interface GetTransactionParam {
  page: number;
  limit: number;
  customerId?: string;
  transactionId?: string;
  filter?: { status?: IsPaid; proofUpload?: boolean };
}

interface CheckoutCustomer {
  username: string;
  email: string;
  image_url: string | null;
}

// BILLING
export interface CheckoutBilling {
  sub_total: number;
  tax: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: PaymentMethod;
}

// SHIPPING
interface CheckoutShipping {
  address: string;
  city: string;
  post_code: string;
  phone_number: string;
}

export interface GetTransactionDto {
  id: string;
  is_paid: IsPaid;
  proof_url: string | null;
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
    image_url: string | File | null;
  };
}

export interface CreateTransactionDetail {
  transaction_id: string;
  product_id: string;
  price: number;
  quantity: number;
}

// CHECKOUT BODY
export const CheckoutBodySchema = z.object({
  address: z.string({ message: "address is required" }).min(1, { message: "address required" }),
  city: z.string({ message: "city is required" }).min(1, { message: "city is required" }),
  post_code: z.string().min(1, { message: "post code is required" }).max(5, { message: "post code should be 5 number" }),
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

// CHECKOUT FEATURE
export interface CheckoutTransactionDto extends CheckoutBilling, CheckoutBodyDto {
  is_paid: IsPaid;
  proof_url: string | null;
}

// UPLOAD PROOF PAYLOAD
export interface UploadProofPayload {
  transactionId: string;
  customerId: string;
  proof_url: string | undefined;
  proof_public_id: string | undefined;
}
