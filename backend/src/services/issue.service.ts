import { Issue } from "../entities";
import { getRepository, Repository } from "typeorm";
import { Service } from "../core";

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
