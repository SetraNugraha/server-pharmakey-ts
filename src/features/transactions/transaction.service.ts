import { IsPaid } from "@prisma/client";
import { AppError } from "../../middlewares/error.middleware";
import { CartModel } from "../carts/cart.model";
import { CustomerModel } from "../customer/customer.model";
import { TransactionModel } from "./transaction.model";
import { CheckoutTransactionDto } from "./transaction.schema";

export class TransactionService {
  constructor(private model: TransactionModel, private cartModel: CartModel, private customerModel: CustomerModel) {}

  getAllTransaction = async () => {
    const data = this.model.getAllTransactions();
    return data;
  };

  getTransactionsByCustomerId = async (customerId: string) => {
    if (!customerId) {
      throw new AppError("customer id not found", 404);
    }

    return await this.model.getTransactionByCustomerId(customerId);
  };

  checkout = async (customerId: string, payload: CheckoutTransactionDto) => {
    if (!customerId) {
      throw new AppError("customer id required", 404);
    }

    const customer = await this.customerModel.getCustomerById(customerId);
    if (!customer) {
      throw new AppError("customer not found", 404);
    }

    const customerCarts = await this.cartModel.getCartByCustomerId(customer.id);
    if (!customerCarts) {
      throw new AppError("customer cart not found", 404);
    }

    // Sub Total
    const subTotal = customerCarts.cart.reduce((total, cart) => total + cart.product.price * cart.quantity, 0);
    // Tax 10%
    const tax = (10 / 100) * subTotal;
    // Deliverify Fee 3%
    const deliveryFee = (2 / 100) * subTotal;
    // Grand Total
    const grandTotalPrice = Number(subTotal) + Number(tax) + Number(deliveryFee);

    const newPayload = {
      is_paid: IsPaid.PENDING,
      proof: null,
      payment_method: payload.payment_method,
      sub_total: Number(subTotal),
      tax: Number(tax),
      delivery_fee: Number(deliveryFee),
      total_amount: Number(grandTotalPrice),
      address: customer.address || payload.address,
      city: customer.city || payload.city,
      post_code: customer.post_code ? Number(customer.post_code) : Number(payload.post_code),
      phone_number: customer.phone_number || payload.phone_number,
      notes: payload.notes,
    };

    // Create Transaction
    const newTransaction = await this.model.checkout(customer.id, newPayload);

    // Mapping items in Carts to Transaction Details => result array
    const cartItems = customerCarts.cart.map((cart) => ({
      transaction_id: newTransaction.id,
      product_id: cart.product_id,
      price: cart.product.price,
      quantity: cart.quantity,
    }));

    // Create trnasaction details
    await this.model.createTransactionDetail(cartItems);

    // Remove all items in customer cart
    await this.cartModel.removeAllItems(customer.id);

    return newTransaction;
  };
}
