import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Exclude, Expose } from "class-transformer";
import { Project } from "entities/project.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public email!: string;

  @Exclude()
  @Column()
  public password!: string;

  @Exclude()
  @Column({ default: 1 })
  public passwordVersion!: number;

  @Column()
  public username!: string;

  @Expose({ groups: ["user"] })
  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable()
  public projects!: Project[];
}
