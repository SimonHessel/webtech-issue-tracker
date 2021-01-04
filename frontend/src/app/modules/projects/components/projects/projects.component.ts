import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Project } from 'core/models/project.model';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { tap } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
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
  //dataSource: Project[] = [];
  currentSearch = '';
  dataSource = new MatTableDataSource<Project>([]);
  length = 0;
  constructor(private readonly projectsService: ProjectsService) {
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
          };

          const lastIndex =
            ((pageEvent.previousPageIndex || 0) + 1) * pageEvent.pageSize - 1;
          console.log(
            this.dataSource.data.length < lastIndex
              ? this.dataSource.data.length - 1
              : lastIndex
          );
          options.skip = this.dataSource.data[
            this.dataSource.data.length < lastIndex
              ? this.dataSource.data.length - 1
              : lastIndex
          ].id;

          if (this.currentSearch) options.search = this.currentSearch;
          this.loadProjects(options);
        })
      )
      .subscribe();
  }

  public addProject() {
    this.projectsService.addProject().subscribe((data) => console.log(data));
  }

  public deleteProject(projectId: number) {
    this.projectsService.deleteProject(projectId).toPromise();
  }
  public search(value: string) {
    this.currentSearch = value;
    this.loadProjects({ search: value });
  }

  private loadProjects(options: Parameters<ProjectsService['getProjects']>[0]) {
    this.subs.sink = this.projectsService.loadProjects(options).subscribe();
  }
}
