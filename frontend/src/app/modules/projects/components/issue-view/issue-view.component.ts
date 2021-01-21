import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Issue } from 'core/models/issue.model';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
import { IssuesService } from 'modules/projects/services/issues.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from 'core/models/project.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { switchMap, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueViewComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  @Input() issue: Issue | undefined = undefined;
  @Input() project: Project | undefined = undefined;

  @Output() updateIssue = new EventEmitter<Issue>();
  edit = false;
  status = '';
  issueForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });
  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly clipboard: Clipboard,
    private readonly issuesService: IssuesService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.issue, this.project);
    if (this.issue && this.project) {
      this.status = this.project.states[this.issue.status];
      this.issueForm.patchValue({
        title: this.issue.title,
        description: this.issue.description,
      });
    } else {
      console.log('no input');
    }
  }

  public changeStatus(state: string) {
    if (this.issue && this.project) {
      this.subs.sink = this.issuesService
        .updateIssue(this.project.id, this.issue.id, {
          status: this.project.states.indexOf(state),
        })
        .subscribe((newIssue) => {
          if (this.issue) {
            this.issue = { ...this.issue, ...newIssue };
          }
          this.status = state;
          this.updateIssue.emit(this.issue);
          this.cdRef.markForCheck();
        });
    }
  }

  public reassignAssignee(newAssignee: string) {
    if (this.issue && this.project) {
      this.subs.sink = this.issuesService
        .updateIssue(this.project.id, this.issue.id, {
          assignee: newAssignee,
        })
        .subscribe((newIssue) => {
          if (this.issue) {
            this.issue = { ...this.issue, ...newIssue };
          }
          this.updateIssue.emit(this.issue);
          this.cdRef.markForCheck();
        });
    }
  }

  public editIssue() {
    this.edit = !this.edit;
    if (this.issue && this.project) {
      this.subs.sink = this.issuesService
        .updateIssue(this.project.id, this.issue.id, {
          title: this.issueForm.value.title,
          description: this.issueForm.value.description,
        })
        .subscribe((newIssue) => {
          if (this.issue) {
            this.issue = { ...this.issue, ...newIssue };
          }
          this.updateIssue.emit(this.issue);
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
    if (this.issue && this.project) {
      this.subs.sink = this.issuesService
        .updateIssue(this.project.id, this.issue.id, {
          priority: newPriority,
        })
        .subscribe((newIssue) => {
          if (this.issue) {
            this.issue = { ...this.issue, ...newIssue };
          }
          this.updateIssue.emit(this.issue);
          this.cdRef.markForCheck();
        });
    }
  }

  public deleteIssue(issueId: Issue['id'], projectId: Project['id']) {
    const snackBarRef = this.snackBar.open(
      $localize`:@@issuedeleted:Issue has been deleted`,
      $localize`:@@undo:undo`,
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
                .open(
                  $localize`:@@deleteundone:Deletion has been undone.`,
                  '',
                  {
                    duration: 3000,
                  }
                )
                .afterDismissed()
            : this.issuesService.deleteIssue(projectId, issueId)
        ),

        tap(
          (res) =>
            res === true &&
            this.router.navigate(['/projects/' + this.project?.id + '/kanban'])
        ),
        catchError((err) => {
          console.log(err);
          return this.snackBar
            .open($localize`:@@deletefailed:Deletion has failed.`, '', {
              duration: 3000,
            })
            .afterDismissed();
        })
      )
      .subscribe(() => this.updateIssue.emit(this.issue));
  }

  public copy() {
    this.clipboard.copy(`${window.location.host}${this.router.url}`);
    this.snackBar.open(
      $localize`:@@linkhasbeencopied:Link has been copied`,
      '',
      {
        duration: 2500,
      }
    );
  }
}
