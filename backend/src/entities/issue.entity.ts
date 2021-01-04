import { Expose, Transform, Type } from "class-transformer";
import { Project } from "entities/project.entity";
import { User } from "entities/user.entity";
import { Priority } from "enums/priority.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  public id!: number;

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

  @Column()
  public status!: string;

  @Expose({ groups: ["issue"] })
  @ManyToOne(() => Project, (project) => project.issues)
  public project!: Project;
}
