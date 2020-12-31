import { Injectable } from "../core";

@Injectable()
export class HashService {
  constructor() {}

  // decide which hashing algorithm should be used
  public hash(password: string): string {
    return password;
  }
}
