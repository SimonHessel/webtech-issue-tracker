import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Issue } from 'core/models/issue.model';
import { Project } from 'core/models/project.model';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  private readonly apiEndpoint = 'issues';

  constructor(private readonly http: HttpClient) {}

  public getIssuesByProject(projectID: Project['id']) {
    return this.http.get<Issue[]>(`${this.apiEndpoint}/${projectID}`);
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
<<<<<<< HEAD
    return this.http.delete(`${this.apiEndpoint}/${projectID}/${id}`, {
      responseType: 'text',
    });
=======
    return this.http
      .delete(`${this.apiEndpoint}/${projectID}/${id}`, {
        responseType: 'text',
      })
      .pipe(mapTo(true));
>>>>>>> d9f2d6f5a7b12d5021ce94dd874ca3208c2a21a5
  }
}
