import { z } from "zod";

interface ProductDetail {
  name: string;
  slug: string;
  category_id?: string | null;
  price: number;
  image_url: string | null;
}

interface CartItems {
  product_id: string;
  quantity: number;
  product: ProductDetail;
}

export interface CustomerCartsDto {
  customer_id: string;
  username: string;
  email: string;
  image_url: string | null;
  cart: CartItems[];
}

export const AddToCartSchema = z.object({
  quantity: z.coerce
    .number({ message: "quantity should be a number" })
    .min(1, { message: "quantity minimun 1" })
    .nonnegative({ message: "quantity cannot be negative" }),
});

export type AddToCartDto = z.infer<typeof AddToCartSchema>;
