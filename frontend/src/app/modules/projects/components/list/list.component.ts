import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'core/models/project.model';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  project: Project | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private readonly projectService: ProjectsService
  ) {
    super();
  }

  ngOnInit(): void {
    const idString = this.route.snapshot.paramMap.get('id');
    if (!idString) throw new Error('Project guard malfunction');
    const id = parseInt(idString, 10);
    this.projectService.setCurrentProject(id).toPromise();
    this.subs.sink = this.projectService.current.subscribe(
      (project) => (this.project = project)
    );
  }
}
