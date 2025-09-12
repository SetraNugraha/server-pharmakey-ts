import { IRouting, HttpMethod } from "../../interface/routing.interface";
import { AdminModule } from "./admin.module";

const { controller } = AdminModule();

export const AdminRoutes: IRouting[] = [
  {
    method: HttpMethod.GET,
    url: "/admin",
    controller: () => {
      console.log("get admin");
    },
  },
];
