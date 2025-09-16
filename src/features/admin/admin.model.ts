import { PaymentMethod, PrismaClient } from "@prisma/client";

export class AdminModel {
  constructor(private prisma: PrismaClient) {}

  dashboard = async () => {
    const [totalRevenue, statusOrders, totalCustomers, totalProducts, topSellingProduct, revenuePerMonth, paymentMethodPerMonth] = await Promise.all([
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

      // TOP SELLING PRODUCT PER MONTH
      this.prisma.$queryRaw<{ productName: string; totalSold: number }[]>`
      SELECT
        p.name AS "productName",
        COALESCE(SUM(td.quantity), 0) AS "totalSold"
      FROM
        "Products" p
        JOIN "Transaction_Details" td ON td.product_id = p.id
        JOIN "Transactions" t ON t.id = td.transaction_id
        AND t.is_paid = 'SUCCESS'
        AND DATE_TRUNC('month', t.updated_at) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY
        p.id
      ORDER BY
        "totalSold" DESC
      LIMIT
        7`,

      // REVENUE PER MONTH
      this.prisma.$queryRaw<{ month: string; revenue: number }[]>`
      WITH months AS (
        SELECT GENERATE_SERIES(
            date_trunc('year', CURRENT_DATE),
            date_trunc('year', CURRENT_DATE) + interval '11 months',
            interval '1 month'
        ) AS month_start
      )
      SELECT 
        TO_CHAR(m.month_start, 'YYYY-MM') AS "month",
        COALESCE(SUM(t.total_amount), 0) AS "revenue"
      FROM months m
      LEFT JOIN "Transactions" t 
        ON DATE_TRUNC('month', created_at) = m.month_start AND t.is_paid = 'SUCCESS'
      GROUP BY m.month_start
      ORDER BY m.month_start`,

      // Payment Method Per Month
      this.prisma.$queryRaw<{ payment_method: PaymentMethod; total: number }[]>`
      WITH paymentMethod AS (
        SELECT UNNEST(ARRAY['TRANSFER'::"PaymentMethod", 'COD'::"PaymentMethod"]) AS payment
      )
      SELECT 
        p.payment AS payment_method,
        COALESCE(COUNT(t.id), 0) AS total
      FROM
        paymentMethod p 
      LEFT JOIN
        "Transactions" t
        ON t.payment_method = p.payment
        AND t.is_paid = 'SUCCESS'
        AND DATE_TRUNC('month', t.updated_at) = DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY
        p.payment
      ORDER BY 
        total DESC`,
    ]);

    return {
      totalRevenue,
      statusOrders,
      totalCustomers,
      totalProducts,
      topSellingProduct,
      revenuePerMonth,
      paymentMethodPerMonth,
    };
  };
}
