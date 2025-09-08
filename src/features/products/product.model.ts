import { PrismaClient } from "@prisma/client";
import { GetProductDto, CreateProductDto, UpdateProductDto } from "./product.schema";
import { IMetadata } from "../../interface/metadata.interface";

export class ProductModel {
  private readonly select = {
    id: true,
    category_id: true,
    name: true,
    slug: true,
    product_image: true,
    price: true,
    description: true,
    created_at: true,
  };
  constructor(private prisma: PrismaClient) {}

  getAllProducts = async (page: number, limit: number): Promise<{ products: GetProductDto[]; meta: IMetadata }> => {
    const offset = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.products.count(),
      this.prisma.products.findMany({
        select: this.select,
        take: limit,
        skip: offset,
        orderBy: { created_at: "desc" },
      }),
    ]);

    const isPrev = page > 1;
    const isNext = offset + limit < total;

    return {
      products: data,
      meta: { isPrev, isNext, total, page, limit },
    };
  };

  getProductByFilter = async (productName?: string, categoryName?: string) => {
    if (!productName && !categoryName) return [];

    const filter: any[] = [];

    if (productName) {
      filter.push({
        name: {
          contains: productName,
          mode: "insensitive",
        },
      });
    }

    if (categoryName) {
      filter.push({
        category: {
          name: {
            contains: categoryName,
            mode: "insensitive",
          },
        },
      });
    }

    const data = await this.prisma.products.findMany({
      where: {
        OR: filter.length > 0 ? filter : undefined,
      },
    });

    return data;
  };

  getProductById = async (productId: string): Promise<GetProductDto | null> => {
    return await this.prisma.products.findFirst({
      where: { id: productId },
      select: this.select,
    });
  };

  getProductBySlug = async (slug: string): Promise<GetProductDto | null> => {
    return await this.prisma.products.findUnique({
      where: { slug },
      select: { ...this.select, category: { select: { name: true, category_image: true } } },
    });
  };

  createProduct = async ({ payload, slug }: { payload: CreateProductDto; slug: string }): Promise<CreateProductDto> => {
    const data = await this.prisma.products.create({
      data: { ...payload, slug },
      select: this.select,
    });

    return data;
  };

  updateProduct = async (
    productId: string,
    {
      payload,
      slug,
    }: {
      payload: UpdateProductDto;
      slug: string | undefined;
    }
  ): Promise<GetProductDto> => {
    const data = await this.prisma.products.update({
      where: { id: productId },
      data: { ...payload, slug },
      select: this.select,
    });

    return data;
  };

  deleteProduct = async (productId: string) => {
    return await this.prisma.products.delete({
      where: { id: productId },
    });
  };
}
