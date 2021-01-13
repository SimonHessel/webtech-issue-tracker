import { Priority } from 'core/enums/priority.enum';
import { PrimaryID } from './id.model';
import { Project } from './project.model';

export interface Issue extends PrimaryID {
  title: string;
  description: string;
  assignee: string;
  priority: Priority;
  status: number;
  position: number;
  project?: Project;
}
