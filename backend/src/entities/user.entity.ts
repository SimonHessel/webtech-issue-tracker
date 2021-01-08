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
  @Exclude()
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ unique: true })
  public email!: string;

  @Column({select: false})
  public VerificationToken!: string;
  
  @Column({select: false, default:false})
  public isVerified!: boolean;

  @Exclude()
  @Column({ select: false })
  public password!: string;

  @Exclude()
  @Column({ default: 1 })
  public passwordVersion!: number;

  @Column({ unique: true })
  public username!: string;

  @Expose({ groups: ["user"] })
  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable()
  public projects!: Project[];
}
