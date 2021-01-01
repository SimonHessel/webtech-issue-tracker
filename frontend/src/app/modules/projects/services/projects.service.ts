import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from 'core/models/project.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class ProjectsService {
  private current$: BehaviorSubject<Project | undefined> = new BehaviorSubject<
    Project | undefined
  >(undefined);
  private apiEndpoint = 'projects';

  private projects$: Observable<Project[]> | undefined = undefined;

  constructor(private http: HttpClient) {}

  get current() {
    return this.current$;
  }

  get projects() {
    if (!this.projects$) {
      this.projects$ = this.getProjects().pipe(shareReplay(1));
    }

    return this.projects$;
  }

  public setCurrentProject(id: number) {
    const observer = this.http.get<Project>(`${this.apiEndpoint}/${id}`);
    observer.subscribe(this.current$);
  }

  private getProjects() {
    return this.http.get<Project[]>(this.apiEndpoint);
  }
}
