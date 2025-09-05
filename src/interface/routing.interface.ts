import { Request, Response, NextFunction } from "express";

export const enum HttpMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export interface IRouting {
  method: HttpMethod;
  url: string;
  middleware?: ((req: Request, res: Response, next: NextFunction) => void)[];
  controller: (req: Request, res: Response, next: NextFunction) => Promise<any> | any;
}
