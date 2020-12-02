import { Service } from "core";
import { Issue } from "entities/issue.entity";
import { getRepository, Repository } from "typeorm";

@Service()
export class IssueService {
  issueRepository: Repository<Issue>;
  constructor() {
    this.issueRepository = getRepository(Issue);
  }

  async getProjectIssues(id: number): Promise<Issue[]> {
    return this.issueRepository.find({ where: { project: { id } } });
  }
}
