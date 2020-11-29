import { Service } from "../core";

@Service()
export class HashService {
  constructor() {}

  public hash(password: string): string {
    return password;
  }
}
