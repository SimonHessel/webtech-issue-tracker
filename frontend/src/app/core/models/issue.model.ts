import { Priority } from 'core/enums/priority.enum';
import { User } from './user.model';

export interface Issue {
  id: number;
  title: string;
  description: string;
  assignee: User;
  priority: Priority;
  status: string;
}
