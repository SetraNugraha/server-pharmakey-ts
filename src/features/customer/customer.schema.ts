import { Role } from "@prisma/client";
import z from "zod";

const CustomerSchema = z.object({
  id: z.string(),
  username: z.string().min(1, { message: "username cannot be empty" }),
  email: z.email({ message: "invalid email format" }).min(1, { message: "email cannot be empty" }),
  password: z.string(),
  role: z.enum(Role).refine((val) => val == Role.CUSTOMER, { message: "role must be customer" }),
  image_url: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (!val || val.trim() === "" ? null : val)),
  image_public_id: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (!val || val.trim() === "" ? null : val)),
  address: z.string().nullable(),
  city: z.string().nullable(),
  post_code: z.string().max(5, { message: "post code should be 5 number" }).nullable(),
  phone_number: z
    .string()
    .min(11, { message: "phone number should be at least 11 number" })
    .max(12, { message: "phone number maximum is 12" })
    .nullable(),
});

//  GET
export type IGetCustomerDto = z.infer<typeof CustomerSchema>;

// UPDATE
export const UpdateCustomerSchema = CustomerSchema.partial().omit({
  id: true,
  password: true,
  role: true,
});
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
