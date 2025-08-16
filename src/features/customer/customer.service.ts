import { CustomerModel } from "./customer.model";

export class CustomerService {
  constructor(private model: CustomerModel) {}

  getAllCustomer = async () => {
    const data = await this.model.getAllCustomers();
    return data;
  };
}
