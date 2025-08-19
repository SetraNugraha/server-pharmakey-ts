import { z } from "zod";

export const CreateProductSchema = z.object({
  category_id: z.string({ message: "category required" }),
  name: z.string({ message: "name required" }).min(3, { message: "name should be at least 3 character" }),
  price: z
    .number()
    .nonnegative({ message: "price cannot be negative" })
    .min(1000, { message: "price minimun Rp.1000" }),
  product_image: z.string().nullable(),
  description: z.string().nullable(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
