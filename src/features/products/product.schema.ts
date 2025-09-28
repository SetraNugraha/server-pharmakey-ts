import { z } from "zod";

// SCHEMA
export const ProductSchema = z.object({
  id: z.string(),
  category_id: z.string().optional().nullable(),
  name: z.string().nonempty("name cannot be empty"),
  slug: z.string(),
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
  price: z.coerce
    .number({ message: "price should be a number" })
    .nonnegative({ message: "price cannot be negative" })
    .min(1000, { message: "price minimun Rp.1000" }),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (!val || val.trim() === "" ? null : val)),
});

// GET
export type GetProductDto = z.infer<typeof ProductSchema>;

// CREATE
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  slug: true,
});
export type CreateProductDto = z.infer<typeof CreateProductSchema>;

// UPDATE
export const UpdateProductSchema = ProductSchema.partial();
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
