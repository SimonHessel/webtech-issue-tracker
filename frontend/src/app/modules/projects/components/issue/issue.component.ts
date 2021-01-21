import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'core/models/issue.model';
import { IssuesService } from 'modules/projects/services/issues.service';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  currentIssue: Issue | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private readonly projectService: ProjectsService,
    private readonly issuesService: IssuesService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    const issueID = this.route.snapshot.paramMap.get('issueID');
    const projectID = this.route.snapshot.paramMap.get('id');
    if (!projectID || !issueID) throw new Error('Project guard malfunction');

    this.subs.sink = this.projectService.current
      .pipe(
        switchMap((project) => {
          const issue = project?.issues?.find((i) => i.id === issueID);
          if (issue && project) {
            const { issues: _, ...projectWithoutIssues } = project;
            issue.project = projectWithoutIssues;
            return of(issue);
          } else return this.issuesService.getIssueByID(projectID, issueID);
        })
      )
      .subscribe((issue) => {
        this.currentIssue = issue;
        this.cdRef.markForCheck();
      });
  }
}
