import { Project } from './project.model';

export interface Me {
  projects: Project['id'][];
  username: string;
  email: string;
  iat: number;
  exp: number;
}
