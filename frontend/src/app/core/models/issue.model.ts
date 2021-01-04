import { Priority } from 'core/enums/priority.enum';

export interface Issue {
  id: number;
  title: string;
  description: string;
  assignee: string;
  priority: Priority;
  status: string;
}
