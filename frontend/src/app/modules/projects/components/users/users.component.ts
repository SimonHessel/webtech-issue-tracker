import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'core/models/project.model';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent
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
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) throw new Error('Project guard malfunction');

    this.subs.sink = this.projectService.setCurrentProject(id).subscribe();

    this.subs.sink = this.projectService.current
      .pipe(
        filter((project) => !!project),
        distinctUntilChanged()
      )
      .subscribe((project) => {
        this.project = project;
        this.cdRef.markForCheck();
      });
  }
}
