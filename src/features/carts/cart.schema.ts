interface ProductDetail {
  name: string;
  category_id: string;
  price: number;
  product_image: string | null;
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
  profile_image: string | null;
  cart: CartItems[];
}
