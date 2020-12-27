/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericClassDecorator, Type } from "../utils";

export const Service = (): GenericClassDecorator<Type<any>> => {
  return (_: Type<any>) => {};
};
