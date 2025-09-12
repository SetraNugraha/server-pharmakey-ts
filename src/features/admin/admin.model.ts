import { PrismaClient } from "@prisma/client/extension";
import { IGetDashboard } from "./admin.schema";
export class AdminModel {
  constructor(private prisma: PrismaClient) {}

  dashboard = async () => {};
}
