import { Service } from "../core";

@Service()
export class HashService {
  constructor() {}

  // decide which hashing algorithm should be used
  public hash(password: string): string {
    return password;
  }
}
