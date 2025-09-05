import { z } from "zod";

// GET
export interface GetCategoryDto {
  id: string;
  name: string;
  slug: string;
  category_image: string | null;
}

// CREATE
export const CreateCategorySchema = z.object({
  name: z.string().nonempty("name is required"),
  category_image: z.string().nullable().optional(),
});
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

// UPDATE
export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
