import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Issue } from 'core/models/issue.model';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  private readonly apiEndpoint = 'issues';

  constructor(private readonly http: HttpClient) {}

  public getIssuesByProject(id: number) {
    return this.http.get<Issue[]>(`${this.apiEndpoint}/${id}`);
  }
}
