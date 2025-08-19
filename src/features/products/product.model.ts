import { PrismaClient } from "@prisma/client";
import { CreateProductDto } from "./dto/create-product.dto";

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

  createProduct = async (payload: {
    category_id: string;
    name: string;
    slug: string;
    price: number;
    product_image: string | null;
    description: string | null;
  }): Promise<GetProductDto> => {
    const data = await this.prisma.products.create({
      data: payload,
    });

    return data;
  };
}
