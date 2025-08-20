import { PrismaClient } from "@prisma/client";
import { GetProductDto, CreateProductDto, UpdateProductDto } from "./product.schema";

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

  getAllProducts = async (page: number, limit: number): Promise<{ data: GetProductDto[]; meta: IMetadata }> => {
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
      data: data,
      meta: { isPrev, isNext, total, page, limit },
    };
  };

  getProductById = async (productId: string): Promise<GetProductDto | null> => {
    return await this.prisma.products.findFirst({
      where: { id: productId },
      select: this.select,
    });
  };

  getProductBySlug = async (slug: string): Promise<GetProductDto | null> => {
    return await this.prisma.products.findFirst({
      where: { slug },
      select: this.select,
    });
  };

  createProduct = async ({ payload, slug }: { payload: CreateProductDto; slug: string }): Promise<GetProductDto> => {
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
