import { IController } from "core";
import * as express from "express";
import {
  ENDPOINTS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from "../constants";
import { RequestMethod } from "../enums/request-method.enum";
export function Controller(path: string) {
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
        return endpoints.forEach((endpoint) => {
          const method = Reflect.getMetadata(
            METHOD_METADATA,
            (this as any)[endpoint]
          );
          const path = Reflect.getMetadata(
            PATH_METADATA,
            (this as any)[endpoint]
          );
          this.registerRoute(path, endpoint, method);
        });
      }
      public registerRoute(
        path: string,
        endpoint: string,
        method: RequestMethod
      ) {
        const f = (this as any)[endpoint].bind(this);
        switch (method) {
          case RequestMethod.GET:
            this.router.get(path, f);
            break;
          case RequestMethod.POST:
            this.router.post(path, f);
            break;
          case RequestMethod.PATCH:
            this.router.patch(path, f);
            break;
          case RequestMethod.PUT:
            this.router.patch(path, f);
            break;
          case RequestMethod.DELETE:
            this.router.delete(path, f);
            break;
          default:
            break;
        }
      }
    };
  };
}
