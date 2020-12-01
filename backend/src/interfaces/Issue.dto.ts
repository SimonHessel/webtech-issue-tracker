import { Priority } from "enums/priority.enum";
import { UserDTO } from "interfaces/User.dto";
export interface IssueDTO {
  title: string;
  description: string;
  assignee: UserDTO["username"];
  priority: Priority;
  status: string;
}
