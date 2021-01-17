import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { ActivatedRoute, Router } from '@angular/router';
import { Priority } from 'core/enums/priority.enum';
import { Issue } from 'core/models/issue.model';
import { Project } from 'core/models/project.model';
import { IssuesService } from 'modules/projects/services/issues.service';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  issue: Issue | undefined = undefined;
  edit = false;
  priority = '';
  status = '';
  issueForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });
  constructor(
    private route: ActivatedRoute,
    private readonly projectService: ProjectsService,
    private readonly issuesService: IssuesService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly clipboard: Clipboard
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
        this.issue = issue;
        this.priority = Priority[issue.priority];
        if (issue.project) this.status = issue.project.states[issue.status];
        this.issueForm.patchValue({
          title: this.issue.title,
          description: this.issue.description,
        });
        this.cdRef.markForCheck();
      });
  }

  public changeStatus(state: string) {
    if (this.issue && this.issue.project) {
      this.subs.sink = this.issuesService
        .updateIssue(this.issue.project.id, this.issue.id, {
          status: this.issue.project.states.indexOf(state),
        })
        .subscribe((newIssue) => {
          if (this.issue) {
            this.issue = { ...this.issue, ...newIssue };
          }
          this.status = state;
          this.cdRef.markForCheck();
        });
    }
  }

  public reassignAssignee(newAssignee: string) {
    if (this.issue && this.issue.project) {
      this.subs.sink = this.issuesService
        .updateIssue(this.issue.project.id, this.issue.id, {
          assignee: newAssignee,
        })
        .subscribe((newIssue) => {
          if (this.issue) {
            this.issue = { ...this.issue, ...newIssue };
          }
          this.cdRef.markForCheck();
        });
    }
  }

  public editIssue() {
    this.edit = !this.edit;
    if (this.issue && this.issue.project) {
      this.subs.sink = this.issuesService
        .updateIssue(this.issue.project.id, this.issue.id, {
          title: this.issueForm.value.title,
          description: this.issueForm.value.description,
        })
        .subscribe((newIssue) => {
          if (this.issue) {
            this.issue = { ...this.issue, ...newIssue };
          }
          this.cdRef.markForCheck();
        });
    }
  }

  public cancelEdit() {
    this.edit = !this.edit;
    if (this.issue) {
      this.issueForm.patchValue({
        title: this.issue.title,
        description: this.issue.description,
      });
    }
  }

  public changePriority(newPriority: number) {
    if (this.issue && this.issue.project) {
      this.subs.sink = this.issuesService
        .updateIssue(this.issue.project.id, this.issue.id, {
          priority: newPriority,
        })
        .subscribe((newIssue) => {
          if (this.issue) {
            this.issue = { ...this.issue, ...newIssue };
            this.priority = Priority[this.issue.priority];
          }
          this.cdRef.markForCheck();
        });
    }
  }

  public deleteIssue(issueId: Issue['id'], projectId: Project['id']) {
    const snackBarRef = this.snackBar.open(
      $localize`:@@6418844871954917379:`,
      $localize`:@@4529258443538479124:`,
      {
        duration: 3000,
      }
    );

    this.subs.sink = snackBarRef
      .afterDismissed()
      .pipe(
        switchMap((event) =>
          event.dismissedByAction
            ? this.snackBar
                .open($localize`:@@3230667219782296046:`, '', {
                  duration: 3000,
                })
                .afterDismissed()
            : this.issuesService.deleteIssue(projectId, issueId).toPromise()
        )
      )
      .subscribe(() => {
        this.router.navigate([
          '/projects/' + this.issue?.project?.id + '/kanban',
        ]);
      });
  }

  public copy() {
    this.clipboard.copy(`${window.location.host}${this.router.url}`);
    this.snackBar.open($localize`:@@1801671542332624782:`, '', {
      duration: 2500,
    });
  }
}
