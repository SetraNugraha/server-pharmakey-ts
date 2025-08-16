import { z } from "zod";
import { Role } from "@prisma/client";

export const RegisterSchema = z
  .object({
    username: z.string().min(3, { message: "username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email format" }),
    role: z
      .string()
      .transform((val) => val.toUpperCase())
      .pipe(z.enum(Role, { message: "Invalid role, role must be ADMIN or CUSTOMRE" })),
    password: z.string().min(6, { message: "password must at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password do not match",
    path: ["confirmPassword"],
  });

export type RegisterDto = z.infer<typeof RegisterSchema>;
