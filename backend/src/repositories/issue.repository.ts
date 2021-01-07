import { Issue } from "entities/issue.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Issue)
export class IssueRepository extends Repository<Issue> {}
