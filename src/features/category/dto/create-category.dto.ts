import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().nonempty("name is required"),
  category_image: z.string().nullable().optional(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
