import "reflect-metadata";
import { Type } from "./utils/inject.util";

export const Injector = new (class {
  private cache = new Map<Type<any>, any>();
  resolve<T>(target: Type<any>): T {
    if (this.cache.has(target)) return this.cache.get(target);
    const tokens = Reflect.getMetadata("design:paramtypes", target) || [];
    const injections = tokens.map((token: any) => Injector.resolve<any>(token));
    const obj = new target(...injections);
    this.cache.set(target, obj);

    return obj;
  }
})();
