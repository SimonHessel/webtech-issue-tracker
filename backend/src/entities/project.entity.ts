import { Priority } from "../enums/priority.enum";
import {
  Entity,
  ObjectID,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Issue } from "./issue.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public title!: string;

  @Column()
  public description!: string;

  @OneToMany(() => Issue, (issue) => issue.project)
  public issues!: Issue[];
}
