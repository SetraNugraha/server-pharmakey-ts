import { Role } from "@prisma/client";
import z from "zod";

const CustomerSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.email({ message: "invalid email format" }),
  password: z.string(),
  role: z.enum(Role).refine((val) => val == Role.CUSTOMER, { message: "role must be customer" }),
  profile_image: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  post_code: z.coerce
    .number({ message: "post code must be a number" })
    .refine((val) => /^\d{5}$/.test(String(val)), {
      message: "post code must be 5 digits",
    })
    .nullable(),
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
