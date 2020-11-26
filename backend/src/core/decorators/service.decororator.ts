import { GenericClassDecorator, Type } from "../utils/inject.util";

export const Service = (): GenericClassDecorator<Type<any>> => {
  return (target: Type<any>) => {};
};
