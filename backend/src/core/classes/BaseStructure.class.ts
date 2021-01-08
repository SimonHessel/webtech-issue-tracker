import { info, error } from "../utils/logger.util";

export class BaseStructure {
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  constructor() {
    this.info = (...args: unknown[]) => info(this.constructor.name, ...args);
    this.error = (...args: unknown[]) => error(this.constructor.name, ...args);
    this.info("Initlized");
  }
}
