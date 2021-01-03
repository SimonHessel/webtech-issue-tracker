import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'core/models/project.model';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent
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
    this.subs.sink = this.projectService.setCurrentProject(id).subscribe();
    this.subs.sink = this.projectService.current.subscribe(
      (project) => (this.project = project)
    );
  }
}
