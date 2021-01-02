import { Project } from "entities/project.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {}
