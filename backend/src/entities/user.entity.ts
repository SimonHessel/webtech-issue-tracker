import { Exclude, Expose } from "class-transformer";
import { PrimaryID } from "entities/id.entity";
import { Project } from "entities/project.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity()
export class User extends PrimaryID {
  @Exclude()
  public id!: string;

  @Column({ unique: true })
  public email!: string;

  @Exclude()
  @Column({ select: false, nullable: true })
  public VerificationToken!: string;

  @Exclude()
  @Column({ select: false, default: false })
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
