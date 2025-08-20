import { Role } from "@prisma/client";

export interface GetCustomerDto {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role | "CUSTOMER";
  profile_image: string | null;
  address: string | null;
  city: string | null;
  post_code: number | null;
  phone_number: string | null;
}
