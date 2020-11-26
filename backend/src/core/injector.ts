import "reflect-metadata";
import { Type } from "./utils/inject.util";

export const Injector = new (class {
  resolve<T>(target: Type<any>): T {
    const tokens = Reflect.getMetadata("design:paramtypes", target) || [];
    const injections = tokens.map((token: any) => Injector.resolve<any>(token));
    return new target(...injections);
  }
})();
