import { Issue } from "entities/issue.entity";
import { UserDTO } from "interfaces/User.dto";
export interface IssueDTO {
  title: Issue["title"];
  description: Issue["description"];
  assignee: UserDTO["username"];
  priority: Issue["priority"];
  status: Issue["status"];
}
