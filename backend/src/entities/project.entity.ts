import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Issue } from "./issue.entity";
import { User } from "./user.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public title!: string;

  @Column()
  public description!: string;

  @OneToMany(() => Issue, (issue) => issue.project)
  public issues!: Issue[];

  @ManyToMany(() => User)
  @JoinTable()
  public users!: User[];
}
