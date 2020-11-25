import { Entity, ObjectID, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public email!: string;

  @Column()
  public password!: string;

  @Column()
  public username!: string;
}
