import { ENTITIES_MEDTADATA } from "../constants";

export const InjectRepository = (entity: unknown): ParameterDecorator => {
  return (target, propertyKey, parameterIndex) => {
    const repositories: Map<number, unknown> =
      Reflect.getMetadata(ENTITIES_MEDTADATA, target) || new Map();
    repositories.set(parameterIndex, entity);
    Reflect.defineMetadata(ENTITIES_MEDTADATA, repositories, target);
  };
};
