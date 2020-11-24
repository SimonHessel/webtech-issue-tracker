import { METHODS_METADATA, METHOD_METADATA, PATH_METADATA } from "../constants";
import { RequestMethod } from "../enums/request-method.enum";
import IController from "../interfaces/IController.interface";
import * as express from "express";
import { Request, Response, Router } from "express";
export default function Controller(path: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor implements IController {
      public router = express.Router();
      path = path ? path : "/";
      constructor(...args: any[]) {
        super();
        this.initRoutes();
      }
      initRoutes() {
        const methods: string[] = Reflect.getMetadata(METHODS_METADATA, this);
        methods &&
          methods.forEach((endpoint) => {
            const method = Reflect.getMetadata(
              METHOD_METADATA,
              (this as any)[endpoint]
            );
            const path = Reflect.getMetadata(
              PATH_METADATA,
              (this as any)[endpoint]
            );
            registerRoute(this.router, path, (this as any)[endpoint], method);
          });
      }
    };
  };
}

const registerRoute = (
  router: Router,
  path: string,
  f: (req: Request, res: Response) => any,
  method: RequestMethod
) => {
  switch (method) {
    case RequestMethod.GET:
      router.get(path, f);
      break;
    case RequestMethod.POST:
      router.post(path, f);
      break;
    case RequestMethod.PATCH:
      router.patch(path, f);
      break;
    case RequestMethod.PUT:
      router.patch(path, f);
      break;
    case RequestMethod.DELETE:
      router.delete(path, f);
      break;
    default:
      break;
  }
};
