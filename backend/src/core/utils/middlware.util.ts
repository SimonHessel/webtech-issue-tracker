import { IMiddleware } from "core";

export const isMultiMiddleware = (
  middleware:
    | IMiddleware["middleware"]
    | { path: string; middlewares: IMiddleware["middleware"][] }
): middleware is { path: string; middlewares: IMiddleware["middleware"][] } =>
  (middleware as { path: string; middlewares: IMiddleware["middleware"][] })
    .path !== undefined;
