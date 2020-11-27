import { GenericClassDecorator, Type } from "../utils";

export const Service = (): GenericClassDecorator<Type<any>> => {
  return (target: Type<any>) => {};
};
