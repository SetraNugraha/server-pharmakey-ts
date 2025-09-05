import { keyof } from "zod";
import { AppError } from "../../middlewares/error.middleware";
import { unlinkImage } from "../../utils/unlinkImage";
import { CustomerModel } from "./customer.model";
import { IGetCustomerDto, UpdateCustomerDto } from "./customer.schema";

export class CustomerService {
  constructor(private model: CustomerModel) {}

  getAllCustomer = async (page: number, limit: number) => {
    const data = await this.model.getAllCustomers(page, limit);
    return data;
  };

  getCustomerById = async (customerId: string) => {
    if (!customerId) {
      throw new AppError("customer id required", 404);
    }

    const customer = await this.model.getCustomerById(customerId);
    if (!customer) {
      throw new AppError("customer not found", 404);
    }

    return customer;
  };

  updateCustomer = async (customerId: string, payload: UpdateCustomerDto) => {
    if (!customerId) {
      throw new AppError("customer id required", 404);
    }

    const customer = await this.model.getCustomerById(customerId);
    if (!customer) {
      throw new AppError("customer not found", 404);
    }

    // Unlink Old Image
    if (customer.profile_image && payload.profile_image) {
      unlinkImage("customers", customer.profile_image);
    }

    const newPayload = {
      username: payload.username ?? customer.username,
      email: payload.email ?? customer.email,
      address: payload.address ?? customer.address,
      city: payload.city ?? customer.city,
      post_code: payload.post_code ?? customer.post_code,
      phone_number: payload.phone_number ?? customer.phone_number,
      profile_image: payload.profile_image ?? customer.profile_image,
    };

    const isChanges = Object.entries(newPayload).some(
      ([key, val]) => val !== undefined && val !== customer[key as keyof typeof customer]
    );

    if (!isChanges) {
      throw new AppError("no feilds are changes", 404);
    }

    return await this.model.updateCustomer(customer.id, newPayload);
  };

  deleteCustomer = async (customerId: string) => {
    if (!customerId) {
      throw new AppError("customer id required", 404);
    }

    const customer = await this.model.getCustomerById(customerId);
    if (!customer) {
      throw new AppError("customer not found", 404);
    }

    if (customer.profile_image) {
      unlinkImage("customers", customer.profile_image);
    }

    await this.model.deleteCustomer(customer.id);
  };
}
