import { prisma } from "../../config/database";
import { AdminController } from "./admin.controller";
import { AdminModel } from "./admin.model";
import { AdminService } from "./admin.service";

export const AdminModule = () => {
  // MODEL
  const adminModel = new AdminModel(prisma);

  //   SERVICE
  const adminService = new AdminService(adminModel);

  const controller = new AdminController(adminService);

  return { controller };
};
