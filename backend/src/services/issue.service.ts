import { InjectRepository, Injectable } from "core";
import { Issue } from "entities/issue.entity";
import { Repository } from "typeorm";

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue) private issueRepository: Repository<Issue>
  ) {}

  async getProjectIssues(id: number): Promise<Issue[]> {
    return this.issueRepository.find({ where: { project: { id } } });
  }
}
