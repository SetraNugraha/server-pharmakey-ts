import express, { Router } from "express";
import { AuthRoutes } from "../auth/auth.route";
import { AdminRoutes } from "../admin/admin.route";
import { CustomerRoutes } from "../customer/customer.route";
import { CategoryRoutes } from "../category/category.route";
import { ProductRoutes } from "../products/product.route";
import { CartRoutes } from "../carts/cart.route";
import { IRouting } from "../../interface/routing.interface";

const router: Router = express.Router();
const allRoutes: IRouting[] = [
  ...AuthRoutes,
  ...AdminRoutes,
  ...CustomerRoutes,
  ...CategoryRoutes,
  ...ProductRoutes,
  ...CartRoutes,
];

allRoutes.forEach((route) => {
  if (route.middleware) {
    router[route.method](route.url, ...route.middleware, route.controller);
  } else {
    router[route.method](route.url, route.controller);
  }
});

export default router;
