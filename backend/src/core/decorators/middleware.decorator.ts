import { IMiddleware } from "core";
import { MIDDLEWARES_METADATA } from "../constants";

export const MethodMiddleware = (middleware: IMiddleware): MethodDecorator => {
  return (target, key, descriptor: PropertyDescriptor) => {
    const currentMiddlewares = Reflect.getMetadata(
      MIDDLEWARES_METADATA,
      descriptor.value
    );
    const middlewares = currentMiddlewares
      ? [middleware, ...currentMiddlewares]
      : [middleware];
    Reflect.defineMetadata(MIDDLEWARES_METADATA, middlewares, descriptor.value);
    return descriptor;
  };
};

export const ControllerMiddleware = (middleware: IMiddleware) => <
  T extends { new (...args: any[]): {} }
>(
  constructor: T
) =>
  class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      const currentMiddlewares = Reflect.getMetadata(
        MIDDLEWARES_METADATA,
        this
      );
      const endpoints = currentMiddlewares
        ? [middleware, ...currentMiddlewares]
        : [middleware];
      Reflect.defineMetadata(MIDDLEWARES_METADATA, endpoints, this);
    }
  };
