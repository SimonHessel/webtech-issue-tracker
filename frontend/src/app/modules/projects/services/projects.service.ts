import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from 'core/models/project.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, take, tap } from 'rxjs/operators';

@Injectable()
export class ProjectsService {
  private current$: BehaviorSubject<Project | undefined> = new BehaviorSubject<
    Project | undefined
  >(undefined);
  private apiEndpoint = 'projects';

  private projectsFetched = false;

  private projects$: BehaviorSubject<Project[]> = new BehaviorSubject<
    Project[]
  >([]);

  constructor(private http: HttpClient) {}

  get current() {
    return this.current$;
  }

  get projects() {
    if (!this.projectsFetched) {
      this.projectsFetched = true;
      this.getProjects()
        .pipe(tap((projects) => this.projects$.next(projects)))
        .subscribe((data) => console.log(data));
    }

    return this.projects$;
  }

  public setCurrentProject(id: number) {
    return this.http
      .get<Project>(`${this.apiEndpoint}/${id}`)
      .pipe(tap((project) => this.current$.next(project)));
  }

  public addProject() {
    return this.http
      .post<Project>(this.apiEndpoint, {
        description: 'testdescription',
        title: 'testtitle',
      })
      .pipe(
        tap((project) => {
          this.projects$.next([...this.projects$.getValue(), project]);
        })
      );
  }

  private getProjects() {
    return this.http.get<Project[]>(this.apiEndpoint);
  }
}
