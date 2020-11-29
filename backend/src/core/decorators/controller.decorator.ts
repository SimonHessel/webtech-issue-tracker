import { IController } from "core";
import { IMiddleware } from "core/interfaces";
import * as express from "express";
import {
  ENDPOINTS_METADATA,
  METHOD_METADATA,
  MIDDLEWARES_METADATA,
  MIDDLEWARE_METHODS_METADATA,
  PATH_METADATA,
} from "../constants";
import { RequestMethod } from "../enums";
import { MiddlewaresMetadata as MethodsMiddlewaresMetadata } from "./middleware.decorator";
export function Controller(path: string) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor implements IController {
      public router = express.Router();
      path = path ? path : "/";
      constructor(...args: any[]) {
        super(...args);
      }
      public initRoutes() {
        const endpoints: string[] =
          Reflect.getMetadata(ENDPOINTS_METADATA, this) || [];
        const middlewares: IMiddleware["middleware"][] =
          Reflect.getMetadata(MIDDLEWARES_METADATA, this) || [];
        const methodsMiddlewaresMetadata: MethodsMiddlewaresMetadata = Reflect.getMetadata(
          MIDDLEWARE_METHODS_METADATA,
          this
        );

        return endpoints.forEach((endpoint) => {
          const method = Reflect.getMetadata(
            METHOD_METADATA,
            (this as any)[endpoint]
          );
          const path = Reflect.getMetadata(
            PATH_METADATA,
            (this as any)[endpoint]
          );

          this.registerRoute(
            path,
            methodsMiddlewaresMetadata
              ? middlewares.filter((middleware) =>
                  Reflect.getMetadata(MIDDLEWARES_METADATA, middleware)
                    ? (
                        methodsMiddlewaresMetadata.get(
                          Reflect.getMetadata(MIDDLEWARES_METADATA, middleware)
                        ) || []
                      ).includes(endpoint)
                    : true
                )
              : middlewares,
            endpoint,
            method
          );
        });
      }
      public registerRoute(
        path: string,
        middlewares: IMiddleware["middleware"][],
        endpoint: string,
        method: RequestMethod
      ) {
        const f = (this as any)[endpoint].bind(this);
        switch (method) {
          case RequestMethod.GET:
            this.router.get(path, ...middlewares, f);
            break;
          case RequestMethod.POST:
            this.router.post(path, ...middlewares, f);
            break;
          case RequestMethod.PATCH:
            this.router.patch(path, ...middlewares, f);
            break;
          case RequestMethod.PUT:
            this.router.patch(path, ...middlewares, f);
            break;
          case RequestMethod.DELETE:
            this.router.delete(path, ...middlewares, f);
            break;
          default:
            break;
        }
      }
    };
  };
}
