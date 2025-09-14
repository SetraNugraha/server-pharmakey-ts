import { IsPaid } from "@prisma/client";

export interface IGetDashboard {
  totalCustomers: number;
  totalProducts: number;
  revenue: {
    month: string;
    total: number;
    growth: number;
    isPositive: boolean;
  };
  statusOrders: {
    status: IsPaid;
    total: number;
  }[];
  topSellingProduct: {
    productName: string;
    totalSold: number;
  }[];
  revenuePerMonth: {
    month: string;
    revenue: number;
  }[];
}
