import { Project } from "../entities/project.entity";
import { getRepository, Repository } from "typeorm";
import { Service } from "../core";

@Service()
export class ProjectService {
  projectRepository: Repository<Project>;
  constructor() {
    this.projectRepository = getRepository(Project);
  }

  public async findByID(id: number) {
    return this.projectRepository.findOne(id);
  }
}
