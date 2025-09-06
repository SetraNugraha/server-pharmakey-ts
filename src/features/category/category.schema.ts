import { z } from "zod";

// SCHEMA
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().nonempty("name is required"),
  slug: z.string(),
  category_image: z.string().nullable().optional(),
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
export type UpdateCategoryDto = z.infer<typeof CategorySchema>;
