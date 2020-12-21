import { ENTITIES_MEDTADATA, ENTITY_MEDTADATA } from "./constants";
import "reflect-metadata";
import { Type } from "./utils/inject.util";
import { getRepository } from "typeorm";

export const Injector = new (class {
  private cache = new Map<Type<any>, any>();
  resolve<T>(target: Type<any>): T {
    if (this.cache.has(target)) return this.cache.get(target);

    const tokens = Reflect.getMetadata("design:paramtypes", target) || [];

    const entities: Map<number, unknown> = Reflect.getMetadata(
      ENTITIES_MEDTADATA,
      target
    );

    const injections = tokens.map((token: any, index: number) => {
      if (entities && entities.has(index)) {
        const entity = entities.get(index);
        token = entity;
        Reflect.defineMetadata(ENTITY_MEDTADATA, entity, token);
      }
      return Injector.resolve<any>(token);
    });

    const entity = Reflect.getMetadata(ENTITY_MEDTADATA, target);
    const obj = entity ? getRepository(entity) : new target(...injections);
    this.cache.set(target, obj);

    return obj;
  }
})();
