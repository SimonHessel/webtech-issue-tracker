/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMiddleware } from "core";
import {
  MIDDLEWARES_METADATA,
  MIDDLEWARE_METHODS_METADATA,
} from "../constants";
import { Injector } from "../injector";
import { Type } from "../utils";

export type MiddlewaresMetadata = Map<string, Array<string | symbol>>;

export interface Options {
  all: boolean;
}

/**
 * MethodDecorator to apply middleware to method
 */
export const MethodMiddleware = (
  middlewareClass: Type<IMiddleware>
): MethodDecorator => {
  return (target, key) => {
    // Key-Value-Map that assigns MiddlewareClassnames to the controller methods that they should be assigned to
    const currentMiddlewareMethods: MiddlewaresMetadata =
      Reflect.getMetadata(MIDDLEWARE_METHODS_METADATA, target) || new Map([]);

    // Key-Value-Map already has the classname key
    if (currentMiddlewareMethods.has(middlewareClass.name)) {
      // get the endpoints array for the middleware classname
      const methods = currentMiddlewareMethods.get(
        middlewareClass.name
      ) as Array<string | symbol>;
      // add endpoint to the array
      methods.push(key);
    } else currentMiddlewareMethods.set(middlewareClass.name, [key]);

    // update the Key-Value-Map
    Reflect.defineMetadata(
      MIDDLEWARE_METHODS_METADATA,
      currentMiddlewareMethods,
      target
    );
  };
};

/**
 * ClassDecorator to initlize a middleware https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
 */
export const Middleware = <M>(
  middlewareClass: Type<M & IMiddleware>,
  options: { all: boolean } = { all: true }
) => <
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends { new (...args: any[]): {} }
>(
  constructor: T
) => {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args); // foward the constructor args to the extended class

      // get object of Middleware class from Injector
      const middlewareObject = Injector.resolve<M & IMiddleware>(
        middlewareClass
      );

      // all middlewares of the current controller
      const currentMiddlewares =
        Reflect.getMetadata(MIDDLEWARES_METADATA, this) || [];

      // get the middleware function
      const middlewareFunction = middlewareObject.middleware.bind(
        middlewareObject
      );

      // add the middleware to the currentmiddlewares of the controller
      Reflect.defineMetadata(
        MIDDLEWARES_METADATA,
        [middlewareFunction, ...currentMiddlewares],
        this
      );

      // if middleware should only be applied to some methods
      if (!options.all) {
        // add Middlewareclassname to middleware function metadata
        Reflect.defineMetadata(
          MIDDLEWARES_METADATA,
          middlewareClass.name,
          middlewareFunction
        );
      }
    }
  };
};
