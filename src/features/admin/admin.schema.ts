export interface IGetDashboard {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  mostSellingProduct: {
    name: string;
    sold: number;
  };
  salesChart: {
    date: string;
    total: number;
  }[];
}
