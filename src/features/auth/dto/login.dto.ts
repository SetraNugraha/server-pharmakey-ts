import { z } from "zod";
import { Role } from "@prisma/client";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "password must at least 6 characters" }),
});

export type LoginDto = z.infer<typeof LoginSchema>;
