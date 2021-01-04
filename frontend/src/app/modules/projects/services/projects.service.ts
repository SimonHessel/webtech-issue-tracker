import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from 'core/models/project.model';
import { User } from 'core/models/user.model';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { IssuesService } from './issues.service';

interface FetchOptions {
  search?: string;
  skip?: number;
  take?: number;
}

@Injectable()
export class ProjectsService {
  private current$: BehaviorSubject<Project | undefined> = new BehaviorSubject<
    Project | undefined
  >(undefined);
  private apiEndpoint = 'projects';

  private currentSearch = '';

  private projectsFetched = false;

  private projects$: BehaviorSubject<Project[]> = new BehaviorSubject<
    Project[]
  >([]);

  constructor(
    private http: HttpClient,
    private readonly issuesService: IssuesService
  ) {}

  get current() {
    return this.current$;
  }

  get projects() {
    if (!this.projectsFetched) {
      this.projectsFetched = true;
      this.getProjects({})
        .pipe(tap((projects) => this.projects$.next(projects)))
        .subscribe();
    }

    return this.projects$;
  }

  public setCurrentProject(id: number) {
    return this.projects$.pipe(
      take(1),
      map((projects) => projects.find((project) => project.id === id)),
      switchMap((project) =>
        project
          ? of(project)
          : this.http.get<Project>(`${this.apiEndpoint}/${id}`)
      ),
      switchMap((project) =>
        project.issues
          ? of(project)
          : this.issuesService
              .getIssuesByProject(project.id)
              .pipe(map((issues) => ({ ...project, issues })))
      ),
      switchMap((project) =>
        project.users
          ? of(project)
          : this.loadProjectUsers(project.id).pipe(
              map((users) => ({ ...project, users }))
            )
      ),
      tap((project) =>
        this.projects$.next(
          this.projects$
            .getValue()
            .map((p) => (p.id === project.id ? project : p))
        )
      ),
      tap((project) => this.current$.next(project))
    );
  }

  public loadProjects(options: FetchOptions) {
    const currentProjects = this.projects$.getValue();
    const lastProjectID = currentProjects[currentProjects.length - 1].id;

    if (options.skip && options.skip < lastProjectID) {
      return of([]);
    }
    return this.getProjects(options).pipe(
      tap((projects) => {
        if (
          (options.search && options.search === this.currentSearch) ||
          !!options.search === !!this.currentSearch
        ) {
          return this.projects$.next([
            ...this.projects$.getValue(),
            ...projects,
          ]);
        }
        this.currentSearch = options.search || '';
        return this.projects$.next(projects);
      })
    );
  }

  public addProject() {
    return this.http
      .post<Project>(this.apiEndpoint, {
        description: 'testdescription',
        title: 'testtitle',
        users: [],
      })
      .pipe(
        tap((project) => {
          this.projects$.next([...this.projects$.getValue(), project]);
        })
      );
  }

  public deleteProject(projectId: number) {
    return this.http
      .delete(`projects/${projectId}`)
      .pipe(
        tap(() =>
          this.projects$.next(
            this.projects$
              .getValue()
              .filter((project) => project.id !== projectId)
          )
        )
      );
  }

  private loadProjectUsers(id: number) {
    return this.http.get<User[]>(`${this.apiEndpoint}/${id}/users`);
  }

  private getProjects(options: FetchOptions) {
    return this.http.get<Project[]>(this.apiEndpoint, {
      params: new HttpParams({
        fromObject: options as { [param: string]: string },
      }),
    });
  }
}
