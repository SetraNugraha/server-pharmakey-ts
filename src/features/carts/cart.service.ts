import { AppError } from "../../middlewares/error.middleware";
import { CustomerModel } from "../customer/customer.model";
import { ProductModel } from "../products/product.model";
import { CartModel } from "./cart.model";

export class CartService {
  constructor(private model: CartModel, private customerModel: CustomerModel, private productModel: ProductModel) {}

  getCartByCustomerId = async (customerId: string) => {
    if (!customerId) {
      throw new AppError("customer id not found", 404);
    }

    const customer = await this.customerModel.getCustomerById(customerId);
    if (!customer) {
      throw new AppError("customer not found", 404);
    }

    return await this.model.getCartByCustomerId(customer.id);
  };

  addToCart = async (customerId: string, productId: string) => {
    if (!customerId || !productId) {
      throw new AppError("customer or product id not found", 404);
    }

    const [customer, product] = await Promise.all([
      this.customerModel.getCustomerById(customerId),
      this.productModel.getProductById(productId),
    ]);

    if (!customer) {
      throw new AppError("customer not found", 404);
    }

    if (!product) {
      throw new AppError("product not found", 404);
    }

    return await this.model.addToCart(customer.id, product.id);
  };

  removeFromCart = async (customerId: string, productId: string) => {
    if (!customerId || !productId) {
      throw new AppError("customer or product id not found", 404);
    }

    const [cart, customer, product] = await Promise.all([
      this.model.findExistsCarts(customerId, productId),
      this.customerModel.getCustomerById(customerId),
      this.productModel.getProductById(productId),
    ]);

    if (!cart) {
      throw new AppError("cart not found", 404);
    }

    if (!customer) {
      throw new AppError("customer not found", 404);
    }

    if (!product) {
      throw new AppError("product not found", 404);
    }

    return await this.model.removeFromCart(customer.id, product.id);
  };
}
