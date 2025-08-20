import { PrismaClient } from "@prisma/client";
import { GetCategoryDto } from "./category.schema";

export class CategoryModel {
  private readonly select = {
    id: true,
    name: true,
    slug: true,
    category_image: true,
    created_at: true,
  };
  constructor(private prisma: PrismaClient) {}

  getAllCategory = async (
    page: number,
    limit: number
  ): Promise<{
    data: GetCategoryDto[];
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
      data: data,
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

  createCategory = async (payload: {
    name: string;
    slug: string;
    category_image: string | null;
  }): Promise<GetCategoryDto> => {
    const data = await this.prisma.category.create({
      data: { ...payload },
      select: this.select,
    });

    return data;
  };

  updateCategory = async (
    categoryId: string,
    payload: { name?: string; category_image?: string | null }
  ): Promise<GetCategoryDto> => {
    const data = await this.prisma.category.update({
      where: { id: categoryId },
      data: payload,
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
