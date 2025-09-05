import { IsPaid } from "@prisma/client";
import { AppError } from "../../middlewares/error.middleware";
import { CartModel } from "../carts/cart.model";
import { CustomerModel } from "../customer/customer.model";
import { TransactionModel } from "./transaction.model";
import { CheckoutTransactionDto } from "./transaction.schema";

export class TransactionService {
  constructor(private model: TransactionModel, private cartModel: CartModel, private customerModel: CustomerModel) {}

  getAllTransaction = async (page: number, limit: number) => {
    return await this.model.getAllTransactions(page, limit);
  };

  getTransactionByTransactionId = async (transactionId: string) => {
    if (!transactionId) {
      throw new AppError("transaction id required", 404);
    }

    const transaction = await this.model.getTransactionByTransactionId(transactionId);

    // DISINI MASALAHNYA, kenapa endpoint /transactions/customer mengarah kesini ?
    if (!transaction || transaction === null) {
      throw new AppError("transaction not foundasdasd", 404);
    }

    return transaction;
  };

  getTransactionsByCustomerId = async (page: number, limit: number, customerId: string) => {
    if (!customerId) {
      throw new AppError("customer id not found", 404);
    }

    return await this.model.getTransactionByCustomerId(page, limit, customerId);
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
    if (!customerCarts.cart || customerCarts.cart === null || customerCarts.cart.length < 1) {
      throw new AppError("Carts is empty", 404);
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
      address: payload.address ?? customer.address,
      city: payload.city ?? customer.city,
      post_code: payload.post_code ?? customer.post_code,
      phone_number: payload.phone_number ?? customer.phone_number,
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

  uploadProof = async (transactionId: string, customerId: string, imageProof: string) => {
    if (!customerId) throw new AppError("customer id required", 404);
    if (!transactionId) throw new AppError("transaction id required", 404);
    if (!imageProof) throw new AppError("file image not found", 404);

    const [customer, transaction] = await Promise.all([
      this.customerModel.getCustomerById(customerId),
      this.model.getTransactionByTransactionId(transactionId),
    ]);

    if (!customer) {
      throw new AppError("customer not found", 404);
    }

    if (!transaction || transaction === null) {
      throw new AppError("transaction not found", 404);
    }

    return await this.model.uploadProof(transaction.id, customer.id, imageProof);
  };

  updateIsPaid = async (transactionId: string, newStatus: IsPaid) => {
    if (!transactionId) {
      throw new AppError("transaction id required", 404);
    }

    const transaction = await this.model.getTransactionByTransactionId(transactionId);
    if (!transaction || transaction === null) {
      throw new AppError("transaction not found", 404);
    }

    if (transaction.is_paid !== "PENDING") {
      throw new AppError("paid status already updated", 400);
    }

    if (newStatus === "SUCCESS" && (!transaction.proof || transaction.proof === null)) {
      throw new AppError("customer must be upload the proof first", 400);
    }

    if (!["SUCCESS", "CANCELLED"].includes(newStatus)) {
      throw new AppError("invalid paid status, paid status must be SUCCESS or CANCELLED", 400);
    }

    return await this.model.updateIsPaid(transaction.id, newStatus);
  };
}
