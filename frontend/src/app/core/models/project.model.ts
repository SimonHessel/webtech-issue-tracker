import { PrimaryID } from './id.model';
import { Issue } from './issue.model';
import { User } from './user.model';

export interface Project extends PrimaryID {
  title: string;
  description: string;
  issues?: Issue[];
  users?: User[];
  states: string[];
  issueAmount?: number[];
}

export type ProjectWithStates = Omit<Project, 'issues'> & {
  issues: Issue[][];
};
