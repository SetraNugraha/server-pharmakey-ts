import { IRouting, HttpMethod } from "../../interface/routing.interface";
import { verifyAdmin, verifyToken } from "../../middlewares/auth.middleware";
import { AdminModule } from "./admin.module";

const { controller } = AdminModule();

export const AdminRoutes: IRouting[] = [
  // GET Dashboard Data
  {
    method: HttpMethod.GET,
    url: "/admin/dashboard",
    middleware: [verifyToken, verifyAdmin],
    controller: controller.dashboard,
  },
];
