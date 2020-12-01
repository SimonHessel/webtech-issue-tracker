import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Priority } from "enums/priority.enum";
import { Project } from "entities/project.entity";
import { User } from "entities/user.entity";

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public title!: string;

  @Column()
  public description!: string;

  @Column((type) => User)
  public assignee!: User;

  @Column()
  public priority!: Priority;

  @Column()
  public status!: string;

  @ManyToOne(() => Project, (project) => project.issues)
  public project!: Project;
}
