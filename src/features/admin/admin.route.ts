import { IRouting, HttpMethod } from "../../interface/routing.interface";

export const AdminRoutes: IRouting[] = [
  {
    method: HttpMethod.GET,
    url: "/admin",
    controller: () => {
      console.log("get admin");
    },
  },
];
