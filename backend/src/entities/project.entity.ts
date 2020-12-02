import { Expose } from "class-transformer";
import { Issue } from "entities/issue.entity";
import { User } from "entities/user.entity";
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

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

  @Expose({ groups: ["project"] })
  @ManyToMany(() => User, (user) => user.projects)
  public users!: User[];
}
