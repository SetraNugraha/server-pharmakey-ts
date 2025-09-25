import { PrismaClient } from "@prisma/client";
import { GetProductDto, CreateProductDto, UpdateProductDto } from "./product.schema";
import { IMetadata } from "../../interface/metadata.interface";

export class ProductModel {
  private readonly select = {
    id: true,
    category_id: true,
    name: true,
    slug: true,
    image_url: true,
    image_public_id: true,
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

  getProductByFilter = async (page: number, limit: number, search?: string): Promise<{ products: GetProductDto[]; meta: IMetadata | null }> => {
    if (!search) return { products: [], meta: null };

    const filter: any[] = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        category: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];

    const offset = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.products.count({
        where: { OR: filter },
      }),
      this.prisma.products.findMany({
        where: { OR: filter },
        take: limit,
        skip: offset,
      }),
    ]);

    const isPrev = page > 1;
    const isNext = offset + limit < total;

    return {
      products: data,
      meta: { page, limit, isPrev, isNext, total },
    };
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
      select: { ...this.select, category: { select: { name: true, image_url: true } } },
    });
  };

  createProduct = async ({ payload, slug }: { payload: CreateProductDto; slug: string }): Promise<CreateProductDto> => {
    const data = await this.prisma.products.create({
      data: { ...payload, slug },
      select: this.select,
    });

    return data;
  };

  updateProduct = async ({ payload, slug }: { payload: UpdateProductDto; slug: string | undefined }): Promise<GetProductDto> => {
    const data = await this.prisma.products.update({
      where: { id: payload.id },
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
