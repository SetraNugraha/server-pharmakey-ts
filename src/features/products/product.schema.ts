import { z } from "zod";

// GET
export interface GetProductDto {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  product_image: string | null;
  price: number;
  description: string | null;
}

// CREATE
export const CreateProductSchema = z.object({
  category_id: z.string({ message: "category required" }),
  name: z.string({ message: "name required" }).min(3, { message: "name should be at least 3 character" }),
  price: z.coerce
    .number({ message: "price should be a number" })
    .nonnegative({ message: "price cannot be negative" })
    .min(1000, { message: "price minimun Rp.1000" }),
  product_image: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (!val || val.trim() === "" ? null : val)),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (!val || val.trim() === "" ? null : val)),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;

// UPDATE
export const UpdateProductSchema = CreateProductSchema.partial().extend({
  category_id: z.string().optional(),
});
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
