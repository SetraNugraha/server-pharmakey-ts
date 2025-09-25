import { z } from "zod";

// SCHEMA
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().nonempty("name is required"),
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
});

// GET
export type GetCategoryDto = z.infer<typeof CategorySchema>;

// CREATE
export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  slug: true,
});
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

// UPDATE
export const UpdateCategorySchema = CategorySchema.partial().omit({
  slug: true,
});
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
