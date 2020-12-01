import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "entities/project.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public email!: string;

  @Column()
  public password!: string;

  @Column()
  public username!: string;

  @ManyToMany(() => Project)
  @JoinTable()
  public projects!: Project[];
}
