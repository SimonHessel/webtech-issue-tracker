import { Component, OnInit } from '@angular/core';
import { Project } from 'core/models/project.model';
import { ProjectsService } from 'modules/projects/services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'members', 'other'];
  dataSource: Project[] = [];
  constructor(private readonly projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projectsService.projects.subscribe((projects) => {
      this.dataSource = projects;
      console.log(projects);
    });
  }

  public addProject() {
    this.projectsService.addProject().subscribe((data) => console.log(data));
  }
}
