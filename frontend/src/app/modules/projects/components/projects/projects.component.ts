import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Project } from 'core/models/project.model';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
import { CreateProjectComponent } from '../create-project/create-project.component';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent
  extends UnsubscribeOnDestroyAdapter
  implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'members', 'other'];
  projects: Project[] = [];
  dataSource = new MatTableDataSource<Project>(this.projects);
  length = 0;
  currentSearch = '';

  constructor(
    private readonly projectsService: ProjectsService,
    public dialog: MatDialog,
    public router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.search = this.search.bind(this);
    this.projectsService.projects.subscribe((projects) => {
      this.dataSource.data = projects;
      this.length = projects.length + 1;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.subs.sink = this.paginator.page
      .pipe(
        tap((pageEvent: PageEvent) => {
          if (
            pageEvent.previousPageIndex &&
            pageEvent.previousPageIndex > pageEvent.pageIndex
          )
            return;

          const options: Parameters<ProjectsService['getProjects']>[0] = {
            take: pageEvent.pageSize,
            skip: this.dataSource.data.length - 1,
          };

          if (this.currentSearch) options.search = this.currentSearch;
          this.loadProjects(options);
        })
      )
      .subscribe();
  }

  public deleteProject(projectId: number) {
    this.projectsService.deleteProject(projectId).toPromise();
  }
  public search(value: string) {
    this.currentSearch = value;
    this.loadProjects({ search: value });
  }

  public openDialog() {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      disableClose: true,
      data: { description: '', title: '' },
      height: '80%',
      width: '90%',
    });

    this.subs.sink = dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) =>
          result
            ? this.addProject(result.description, result.title)
            : throwError(false)
        )
      )
      .subscribe(
        (data) => this.router.navigate(['./projects/', data.id]),
        (err) => {}
      );
  }

  private addProject(description: string, title: string) {
    return this.projectsService.addProject(description, title);
  }

  private loadProjects(options: Parameters<ProjectsService['getProjects']>[0]) {
    this.subs.sink = this.projectsService.loadProjects(options).subscribe();
  }
}
