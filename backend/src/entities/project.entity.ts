import { Expose } from "class-transformer";
import { PrimaryID } from "entities/id.entity";
import { Issue } from "entities/issue.entity";
import { User } from "entities/user.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";

@Entity()
export class Project extends PrimaryID {
  @Column()
  public title!: string;

  @Column()
  public description!: string;

  @Column("simple-array", { default: "open,in progress,doing" })
  public states!: string[];

  @OneToMany(() => Issue, (issue) => issue.project)
  public issues!: Issue[];

  @Expose({ groups: ["project", "issue"] })
  @ManyToMany(() => User, (user) => user.projects)
  public users!: User[];
}
