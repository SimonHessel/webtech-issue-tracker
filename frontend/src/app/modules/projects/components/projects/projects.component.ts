import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Project } from 'core/models/project.model';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
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
  projects: Project[] = [];
  dataSource = new MatTableDataSource<Project>(this.projects);
  constructor(private readonly projectsService: ProjectsService) {
    super();
  }

  ngOnInit() {
    this.search = this.search.bind(this);
  }

  ngAfterViewInit(): void {
    console.log(this.dataSource);
    this.dataSource.paginator = this.paginator;
    this.projectsService.projects.subscribe(
      //vorher: this.dataSource = projects;
      (projects) => (this.dataSource.data = projects)
    );
  }

  public addProject() {
    this.projectsService.addProject().subscribe((data) => console.log(data));
  }

  public deleteProject(projectId: number) {
    this.projectsService.deleteProject(projectId).toPromise();
  }
  public search(value: string) {
    this.subs.sink = this.projectsService
      .loadProjects({ search: value })
      .subscribe();
  }
}
