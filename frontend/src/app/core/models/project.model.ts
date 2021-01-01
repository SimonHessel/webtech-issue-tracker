import { Issue } from './issue.model';
import { User } from './user.model';

export interface Project {
  id: number;
  title: string;
  description: string;
  issues?: Issue[];
  users: User[];
}
