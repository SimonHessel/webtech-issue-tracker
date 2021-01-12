import { PrimaryGeneratedColumn } from "typeorm";

export abstract class PrimaryID {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;
}
