import { Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'core/models/issue.model';
import { Project } from 'core/models/project.model';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

type ProjectWithStates = Omit<Project, 'issues'> & {
  issues: Issue[][];
};

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  project: Project | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private readonly projectService: ProjectsService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    const idString = this.route.snapshot.paramMap.get('id');
    if (!idString) throw new Error('Project guard malfunction');
    const id = parseInt(idString, 10);
    this.subs.sink = this.projectService.setCurrentProject(id).subscribe();
    this.subs.sink = this.projectService.current
      .pipe(
        filter((project) => !!project),
        distinctUntilChanged(),
        map((value) => {
          const { issues, ...project } = value as Project;

          if (issues) {
            (project as ProjectWithStates).issues = new Array(
              project.states.length
            );
            for (let i = 0; i < project.states.length; i++) {
              (project as ProjectWithStates).issues[i] = [];
            }

            for (const issue of issues) {
              (project as ProjectWithStates).issues[issue.status].push(issue);
            }
          }

          return project;
        })
      )
      .subscribe((project) => {
        this.project = project;
        this.cdRef.markForCheck();
      });
  }
}
