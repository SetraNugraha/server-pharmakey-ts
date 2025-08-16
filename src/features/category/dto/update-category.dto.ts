import { z } from "zod";

export const UpdateCategorySchema = z.object({
  name: z.string().nonempty("name is required").optional(),
  category_image: z.string().nullable().optional(),
});

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
