import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Issue } from 'core/models/issue.model';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  private readonly apiEndpoint = 'issues';

  constructor(private readonly http: HttpClient) {}

  public getIssuesByProject(projectID: number) {
    return this.http.get<Issue[]>(`${this.apiEndpoint}/${projectID}`);
  }

  public updateStatusOrder(
    projectID: number,
    id: number,
    position: number,
    status: number
  ) {
    return this.http.patch<Issue>(
      `${this.apiEndpoint}/${projectID}/${id}/reorder`,
      {
        position,
        status,
      }
    );
  }
}
