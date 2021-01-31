import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Priority } from 'core/enums/priority.enum';
import { Issue } from 'core/models/issue.model';
import { Project } from 'core/models/project.model';
import { mapTo } from 'rxjs/operators';

@Injectable()
export class IssuesService {
  private readonly apiEndpoint = 'issues';

  constructor(private readonly http: HttpClient) {}

  public getIssuesByProject(
    projectID: Project['id'],
    options?: {
      assignee?: string;
      status?: number;
      search?: string;
      priority?: Priority;
    }
  ) {
    return this.http.get<Issue[]>(`${this.apiEndpoint}/${projectID}`, {
      params: new HttpParams({
        fromObject: options as { [param: string]: string },
      }),
    });
  }

  public getIssueByID(projectID: Project['id'], id: Issue['id']) {
    return this.http.get<Issue>(`${this.apiEndpoint}/${projectID}/${id}`);
  }
  public updateIssue(
    projectID: Project['id'],
    id: Issue['id'],
    issue: Partial<Issue>
  ) {
    return this.http.patch<Partial<Issue>>(
      `${this.apiEndpoint}/${projectID}/${id}`,
      issue
    );
  }

  public updateStatusOrder(
    projectID: Project['id'],
    id: Issue['id'],
    position: Issue['position'],
    status: Issue['status']
  ) {
    return this.http.patch(
      `${this.apiEndpoint}/${projectID}/${id}/reorder`,
      {
        position,
        status,
      },
      { responseType: 'text' }
    );
  }

  public deleteIssue(projectID: Project['id'], id: Issue['id']) {
    return this.http
      .delete(`${this.apiEndpoint}/${projectID}/${id}`, {
        responseType: 'text',
      })
      .pipe(mapTo(true));
  }

  public createIssue(
    projectID: Project['id'],
    title: string,
    description: string,
    assignee: string,
    priority: Priority,
    status: number
  ) {
    return this.http.post(`${this.apiEndpoint}/${projectID}`, {
      title,
      description,
      assignee,
      priority,
      status,
    });
  }
}
