import { Expose, Transform, Type } from "class-transformer";
import { PrimaryID } from "entities/id.entity";
import { Project } from "entities/project.entity";
import { User } from "entities/user.entity";
import { Priority } from "enums/priority.enum";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Issue extends PrimaryID {
  @Column()
  public title!: string;

  @Column()
  public description!: string;

  @Type(() => User)
  @Transform((user: User) => user.username)
  @ManyToOne(() => User, {
    eager: true,
  })
  public assignee!: User;

  @Column()
  public priority!: Priority;

  @Column({ default: 0 })
  public status!: number;

  @Column()
  public position!: number;

  @Expose({ groups: ["issue"] })
  @ManyToOne(() => Project, (project) => project.issues, {
    onDelete: "CASCADE",
  })
  public project!: Project;
}
