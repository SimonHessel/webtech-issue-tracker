import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'core/models/issue.model';
import { Project, ProjectWithStates } from 'core/models/project.model';
import { IssuesService } from 'modules/projects/services/issues.service';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  project: ProjectWithStates | undefined;

  constructor(
    private route: ActivatedRoute,
    private readonly projectService: ProjectsService,
    private readonly issueService: IssuesService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) throw new Error('Project guard malfunction');

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

          return project as ProjectWithStates;
        })
      )
      .subscribe((project) => {
        this.project = project;
        this.cdRef.markForCheck();
      });
  }

  //state und reihenfolge anpassen
  public async drop(event: CdkDragDrop<Issue[]>) {
    let position = 0;

    const length = event.previousContainer === event.container ? 0 : 1;

    if (event.currentIndex === 0) position = 1;
    else if (event.currentIndex === event.container.data.length + length - 1)
      position =
        event.container.data[event.container.data.length - 1].position + 1;
    else if (event.currentIndex > event.previousIndex)
      position = event.container.data[event.currentIndex + 1 - length].position;
    else if (event.currentIndex <= event.previousIndex)
      position = event.container.data[event.currentIndex - length].position;

    const { id } = await event.previousContainer.data[event.previousIndex];

    const status = await parseInt(event.container.id, 10);

    await (() => {
      event.container.data.forEach(
        (issue) => issue.position >= position && issue.position++
      );
      event.previousContainer.data[event.previousIndex].position = position;
    })();
    if (event.previousContainer === event.container) {
      if (event.currentIndex !== event.previousIndex) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    if (this.project)
      this.issueService
        .updateStatusOrder(this.project.id, id, position, status)
        .subscribe();
  }

  trackByMethod(index: number, issue: Issue): Issue['id'] {
    return issue.id;
  }
}
