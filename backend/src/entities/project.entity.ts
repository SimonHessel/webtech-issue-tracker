import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Issue } from "entities/issue.entity";
import { User } from "entities/user.entity";

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
  public users!: User[];
}
