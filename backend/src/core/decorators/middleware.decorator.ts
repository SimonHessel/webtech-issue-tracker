import { IMiddleware } from "core";
import {
  MIDDLEWARES_METADATA,
  MIDDLEWARE_METHODS_METADATA,
} from "../constants";
import { Injector } from "../injector";
import { Type } from "../utils";

export type MiddlewaresMetadata = Map<string, Array<string | symbol>>;

export const MethodMiddleware = (
  middlewareClass: Type<IMiddleware>
): MethodDecorator => {
  return (target, key, descriptor: PropertyDescriptor) => {
    const currentMiddlewareMethods: MiddlewaresMetadata =
      Reflect.getMetadata(MIDDLEWARE_METHODS_METADATA, target) || new Map([]);

    if (currentMiddlewareMethods.has(middlewareClass.name)) {
      const methods = currentMiddlewareMethods.get(
        middlewareClass.name
      ) as Array<string | symbol>;
      methods.push(key);
    } else {
      currentMiddlewareMethods.set(middlewareClass.name, [key]);
    }

    Reflect.defineMetadata(
      MIDDLEWARE_METHODS_METADATA,
      currentMiddlewareMethods,
      target
    );
  };
};

export interface Options {
  all: boolean;
}

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
      super(...args);

      const middlewareObject = Injector.resolve<M & IMiddleware>(
        middlewareClass
      );
      const currentMiddlewares = Reflect.getMetadata(
        MIDDLEWARES_METADATA,
        this
      );

      const middlewareFunction = middlewareObject.middleware.bind(
        middlewareObject
      );

      const endpoints = currentMiddlewares
        ? [middlewareFunction, ...currentMiddlewares]
        : [middlewareFunction];
      Reflect.defineMetadata(MIDDLEWARES_METADATA, endpoints, this);

      if (!options.all) {
        Reflect.defineMetadata(
          MIDDLEWARES_METADATA,
          middlewareClass.name,
          middlewareFunction
        );
      }
    }
  };
};
