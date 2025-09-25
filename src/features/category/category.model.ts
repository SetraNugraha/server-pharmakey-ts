import { PrismaClient } from "@prisma/client";
import { CreateCategorySchema, CreateCategoryDto, GetCategoryDto, UpdateCategoryDto } from "./category.schema";
import { IMetadata } from "../../interface/metadata.interface";

export class CategoryModel {
  private readonly select = {
    id: true,
    name: true,
    slug: true,
    image_url: true,
    image_public_id: true,
  };
  constructor(private prisma: PrismaClient) {}

  getAllCategory = async (
    page: number,
    limit: number
  ): Promise<{
    categories: GetCategoryDto[];
    meta: IMetadata;
  }> => {
    const offset = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.category.count(),
      this.prisma.category.findMany({
        skip: offset,
        take: limit,
        select: this.select,
        orderBy: { created_at: "desc" },
      }),
    ]);

    const isPrev = page > 1;
    const isNext = offset + limit < total;

    return {
      categories: data,
      meta: { isPrev, isNext, total, page, limit },
    };
  };

  getCategoryById = async (categoryId: string): Promise<GetCategoryDto | null> => {
    return await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
  };

  getCategoryBySlug = async (slug: string): Promise<GetCategoryDto | null> => {
    return await this.prisma.category.findFirst({
      where: { slug },
    });
  };

  createCategory = async ({ payload, slug }: { payload: CreateCategoryDto; slug: string }): Promise<GetCategoryDto> => {
    const data = await this.prisma.category.create({
      data: { ...payload, slug },
      select: this.select,
    });

    return data;
  };

  updateCategory = async ({ payload, slug }: { payload: UpdateCategoryDto; slug: string }): Promise<GetCategoryDto> => {
    const data = await this.prisma.category.update({
      where: { id: payload.id },
      data: { ...payload, slug },
      select: this.select,
    });

    return data;
  };

  deleteCategory = async (categoryId: string) => {
    await this.prisma.category.delete({
      where: { id: categoryId },
    });
  };
}
