import { Priority } from 'core/enums/priority.enum';
import { PrimaryID } from './id.model';

export interface Issue extends PrimaryID {
  title: string;
  description: string;
  assignee: string;
  priority: Priority;
  status: number;
  position: number;
}
