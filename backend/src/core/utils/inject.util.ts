/**
 * Type for what object is instances of
 */
export interface Type<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}

export type GenericClassDecorator<T> = (target: T) => void;
