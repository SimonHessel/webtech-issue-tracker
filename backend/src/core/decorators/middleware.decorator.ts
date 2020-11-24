import { IMiddleware, IController } from "core";

export function Middleware(middleware: IMiddleware) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super();
        ((this as unknown) as IController).router.use(middleware);
      }
    };
  };
}
