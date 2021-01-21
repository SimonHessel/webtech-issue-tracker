import { BaseStructure, Injectable } from "../core";

@Injectable()
export class HashService extends BaseStructure {
  constructor() {
    super();
  }

  // decide which hashing algorithm should be used
  public hash(password: string): string {
    return password;
  }
}
