import { Priority } from "enums/priority.enum";
import { User } from "./User.interface";
export interface Issue {
  title: string;
  description: string;
  assignee: User["id"];
  priority: Priority;
  status: string;
}
