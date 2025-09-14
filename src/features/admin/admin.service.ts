import { IsPaid } from "@prisma/client";
import { AdminModel } from "./admin.model";
import { IGetDashboard } from "./admin.schema";

export class AdminService {
  constructor(private model: AdminModel) {}

  dashboard = async (): Promise<IGetDashboard> => {
    const dataDaashboard = await this.model.dashboard();

    const safeNumber = (val: any) => {
      return Number(val ?? 0);
    };

    const sasnitizedTopSellingProducts = dataDaashboard.topSellingProduct.map((p) => ({
      productName: p.productName,
      totalSold: safeNumber(p.totalSold),
    }));

    const sanitizedRevenuePerMonth = dataDaashboard.revenuePerMonth.map((r) => ({
      month: r.month,
      revenue: safeNumber(r.revenue),
    }));

    const sanitizedStatusOrders = dataDaashboard.statusOrders.map((s) => ({
      status: s.status as IsPaid,
      total: safeNumber(s.total_orders),
    }));

    // Process Total Revenue with Growth
    let totalRevenueWithGrowth = { month: "", total: 0, growth: 0, isPositive: false };

    if (dataDaashboard.totalRevenue.length >= 2) {
      const current = safeNumber(dataDaashboard.totalRevenue[0].total_revenue);
      const prev = safeNumber(dataDaashboard.totalRevenue[1].total_revenue);

      // prettier-ignore
      const growth = prev !== 0 ? Number((((current - prev) / prev) * 100).toFixed(2)) : 0

      totalRevenueWithGrowth = {
        month: dataDaashboard.totalRevenue[0].month,
        total: current,
        growth,
        isPositive: growth > 0,
      };
    }

    return {
      revenue: totalRevenueWithGrowth,
      statusOrders: sanitizedStatusOrders,
      totalCustomers: safeNumber(dataDaashboard.totalCustomers[0].totalCustomers),
      totalProducts: safeNumber(dataDaashboard.totalProducts[0].totalProducts),
      topSellingProduct: sasnitizedTopSellingProducts,
      revenuePerMonth: sanitizedRevenuePerMonth,
    };
  };
}
