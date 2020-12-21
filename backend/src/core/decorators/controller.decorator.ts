import { IController } from "core";
import { IMiddleware } from "core/interfaces";
import {
  MethodType,
  Method,
  RequestMethodToMethodType,
  Parameter,
} from "../Swagger";
import * as express from "express";
import {
  ENDPOINTS_METADATA,
  METHOD_METADATA,
  MIDDLEWARES_METADATA,
  MIDDLEWARE_METHODS_METADATA,
  PATH_METADATA,
  SUMMARY_METADATA,
} from "../constants";
import { RequestMethod } from "../enums";
import { MiddlewaresMetadata as MethodsMiddlewaresMetadata } from "./middleware.decorator";

/**
 * ClassDecorator to initlize the class as an controller https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
 */
export function Controller(path: string) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor implements IController {
      public router = express.Router(); // init the express router
      path = path ? path : "/"; // set the path
      constructor(...args: any[]) {
        super(...args); // foward the constructor args to the extended class
      }

      public generateSwagger(): {
        [key: string]: { [key in MethodType]: Method };
      } {
        const endpoints: string[] =
          Reflect.getMetadata(ENDPOINTS_METADATA, this) || [];
        const middlewares: IMiddleware["middleware"][] =
          Reflect.getMetadata(MIDDLEWARES_METADATA, this) || [];
        const methodsMiddlewaresMetadata: MethodsMiddlewaresMetadata = Reflect.getMetadata(
          MIDDLEWARE_METHODS_METADATA,
          this
        );

        return endpoints.reduce(
          (
            acc: { [key: string]: { [key in MethodType]: Method } },
            endpoint
          ) => {
            const method: RequestMethod = Reflect.getMetadata(
              METHOD_METADATA,
              (this as any)[endpoint]
            );
            const subPath: string = Reflect.getMetadata(
              PATH_METADATA,
              (this as any)[endpoint]
            );

            const summary: string = Reflect.getMetadata(
              SUMMARY_METADATA,
              (this as any)[endpoint]
            );

            const completePath = `/${path}${subPath.length > 1 ? subPath : ""}`;

            const obj = acc[completePath] || {};
            obj[RequestMethodToMethodType(method)] = {
              consumes: ["application/json"],
              description: "default description",
              tags: [path],
              summary,

              operationId: path + endpoint,

              produces: [],
              parameters: [
                ...subPath
                  .split("/")
                  .filter((parameter) => parameter.includes(":"))
                  .map<Parameter>((parameter) => ({
                    in: "path",
                    name: parameter.replace(":", ""),
                    required: true,
                    description: "description",
                    type: "string",
                    responses: {
                      200: { description: "sucess" },
                      400: { description: "fail" },
                    },
                  })),
              ],
            };

            acc[completePath] = obj;

            return acc;
          },
          {}
        );
      }

      public initRoutes() {
        // array of controller method names
        const endpoints: string[] =
          Reflect.getMetadata(ENDPOINTS_METADATA, this) || [];

        // array of middleware functions
        const middlewares: IMiddleware["middleware"][] =
          Reflect.getMetadata(MIDDLEWARES_METADATA, this) || [];

        // Key-Value-Map that assigns MiddlewareClassnames to the controller methods that they should be assigned to
        const methodsMiddlewaresMetadata: MethodsMiddlewaresMetadata = Reflect.getMetadata(
          MIDDLEWARE_METHODS_METADATA,
          this
        );

        endpoints.forEach((endpoint) => {
          // method(i.e. get,post, etc.) of controller endpoint
          const method = Reflect.getMetadata(
            METHOD_METADATA,
            (this as any)[endpoint]
          );

          // path of controller endpoint
          const path = Reflect.getMetadata(
            PATH_METADATA,
            (this as any)[endpoint]
          );

          this.registerRoute(
            path,

            methodsMiddlewaresMetadata
              ? // if endpoint has a least one special middleware assigned to it filter the middleware array
                middlewares.filter((middleware) =>
                  // check if classname of middleware function is set
                  Reflect.getMetadata(MIDDLEWARES_METADATA, middleware)
                    ? // get controller endpoints that should use the middleware
                      (
                        methodsMiddlewaresMetadata.get(
                          Reflect.getMetadata(MIDDLEWARES_METADATA, middleware)
                        ) || []
                      )
                        // return true if the current endpoint is one of the endpoints
                        .includes(endpoint)
                    : true
                )
              : // Key-Value-Map is not defined apply all middlewares
                middlewares,
            endpoint,
            method
          );
        });
      }

      /**
       * Helper function to register an endpoint with the express router
       */
      public registerRoute(
        path: string,

        // array of middleware express functions
        middlewares: IMiddleware["middleware"][],
        endpoint: string,
        method: RequestMethod
      ) {
        // controller method which is named {endpoint}
        const func = (this as any)[endpoint].bind(this);

        // use the express routers respective function to register the correct http method
        switch (method) {
          case RequestMethod.GET:
            this.router.get(path, ...middlewares, func);
            break;
          case RequestMethod.POST:
            this.router.post(path, ...middlewares, func);
            break;
          case RequestMethod.PATCH:
            this.router.patch(path, ...middlewares, func);
            break;
          case RequestMethod.PUT:
            this.router.patch(path, ...middlewares, func);
            break;
          case RequestMethod.DELETE:
            this.router.delete(path, ...middlewares, func);
            break;
          default:
            break;
        }
      }
    };
  };
}
