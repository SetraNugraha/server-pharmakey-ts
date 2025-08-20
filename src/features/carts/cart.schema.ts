interface ProductDetail {
  name: string;
  price: number;
  product_image: string | null;
}

interface CartItems {
  product_id: string;
  quantity: number;
  products: ProductDetail;
}

export interface CustomerCarts {
  customer_id: string;
  username: string;
  email: string;
  profile_image: string | null;
  carts: CartItems[];
}
