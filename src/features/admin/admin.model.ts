import { PrismaClient } from "@prisma/client";

export class AdminModel {
  constructor(private prisma: PrismaClient) {}

  dashboard = async () => {
    const [totalRevenue, statusOrders, totalCustomers, totalProducts, topSellingProduct, revenuePerMonth] = await Promise.all([
      // TOTAL REVENUE CURRENT MONTH & CURRENT MONTH - 1
      this.prisma.$queryRaw<{ month: string; total_revenue: number }[]>`
      WITH months AS (
        SELECT DATE_TRUNC('month', CURRENT_DATE) AS month
        UNION ALL
        SELECT DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      )
      SELECT TO_CHAR(m.month, 'YYYY-MM') AS "month", COALESCE(SUM(t.total_amount), 0) AS "total_revenue" FROM months m
      LEFT JOIN "Transactions" t on DATE_TRUNC('month', t.created_at) = m.month AND t.is_paid = 'SUCCESS'
      GROUP BY m.month
      ORDER BY m.month DESC`,

      // STATUS ORDER & COUNT BY CURRENT MONTH
      this.prisma.$queryRaw<{ status: string; total_orders: number }[]>`
      WITH status_paid AS (
        SELECT UNNEST(ARRAY['SUCCESS'::"IsPaid", 'PENDING'::"IsPaid", 'CANCELLED'::"IsPaid"]) AS is_paid
      )
      SELECT
        s.is_paid AS status,
        COALESCE(COUNT(t.*), 0) AS total_orders
      FROM status_paid s
      LEFT JOIN "Transactions"
        t ON t.is_paid = s.is_paid
        AND DATE_TRUNC('month', t.created_at) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY s.is_paid
      ORDER BY s.is_paid`,

      // TOTAL CUSTOMERS
      this.prisma.$queryRaw<{ totalCustomers: number }[]>`
      SELECT COUNT(*) AS "totalCustomers"
      FROM "Users"
      WHERE role = 'CUSTOMER'`,

      // TOTAL PRODUCTS
      this.prisma.$queryRaw<{ totalProducts: number }[]>`
      SELECT COUNT(*) AS "totalProducts"
      FROM "Products"`,

      // TOP SELLING PRODUCT ALL THE TIME
      this.prisma.$queryRaw<{ productName: string; totalSold: number }[]>`
      SELECT p.name AS "productName",
             COALESCE(SUM(td.quantity), 0) AS "totalSold"
      FROM "Products" p
      JOIN "Transaction_Details" td ON td.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY "totalSold" DESC
      LIMIT 5`,

      // REVENUE PER MONTH
      this.prisma.$queryRaw<{ month: string; revenue: number }[]>`
      SELECT TO_CHAR(created_at, 'YYYY-MM') AS "month",
             SUM(total_amount) AS "revenue"
      FROM "Transactions"
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY "month"`,
    ]);

    return {
      totalRevenue,
      statusOrders,
      totalCustomers,
      totalProducts,
      topSellingProduct,
      revenuePerMonth,
    };
  };
}
