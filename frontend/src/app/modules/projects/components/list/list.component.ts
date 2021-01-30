import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Priority } from 'core/enums/priority.enum';
import { Issue } from 'core/models/issue.model';
import { Project } from 'core/models/project.model';
import { IssuesService } from 'modules/projects/services/issues.service';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { throwError } from 'rxjs';
import { of } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
import { CreateIssueComponent } from '../create-issue/create-issue.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  public project: Project | undefined = undefined;
  public projectID = '';
  public currentIssue: Issue | undefined = undefined;
  public searchDefault = '';

  private readonly searchRegex = new RegExp(
    /(assignee=(?<assignee>\w+)|priority=(?<priority>\d+)|status=(?<status>\d+)|(?<search>\w+))/
  );

  private options = this.parseSearchQuery(this.searchDefault);

  constructor(
    private route: ActivatedRoute,
    private readonly projectService: ProjectsService,
    private readonly issueService: IssuesService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.search = this.search.bind(this);
    this.projectID = this.route.snapshot.paramMap.get('id') || '';

    this.searchDefault = Object.entries(this.route.snapshot.queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');

    this.subs.sink = this.projectService
      .setCurrentProject(this.projectID)
      .subscribe();

    this.subs.sink = this.projectService.current
      .pipe(
        filter((project) => !!project),
        distinctUntilChanged(),
        switchMap((project) =>
          this.searchDefault
            ? this.issueService
                .getIssuesByProject(
                  this.projectID,
                  this.removeUndefined(
                    this.parseSearchQuery(this.searchDefault)
                  )
                )
                .pipe(map((issues) => ({ ...(project as Project), issues })))
            : of(project)
        )
      )
      .subscribe((project) => {
        this.project = project;

        this.cdRef.markForCheck();
      });
  }

  public openDialog() {
    const dialogRef = this.dialog.open(CreateIssueComponent, {
      disableClose: true,
      data: {
        project: this.project,
        title: '',
        description: '',
        assignee: '',
        priority: 0,
        status: 0,
      },
      height: '80%',
      width: '90%',
    });

    this.subs.sink = dialogRef
      .afterClosed()
      .pipe(
        switchMap((output) =>
          output
            ? this.addIssue(
                output.title,
                output.description,
                output.assignee,
                output.priority,
                output.status
              )
            : throwError(false)
        )
      )
      .subscribe(() => this.updateIssueList());
  }

  public updateIssue(issue: Issue) {
    if (this.project) {
      this.project.issues = this.project.issues?.map((i) =>
        i.id === issue.id ? issue : i
      );
    }
    this.cdRef.markForCheck();
  }

  public search(value: string) {
    this.options = this.parseSearchQuery(value);
    this.updateIssueList();
  }

  public toggleSelectedIssue(issue: Issue) {
    this.currentIssue = issue;
  }

  private parseSearchQuery(value: string) {
    return value
      .split(' ')
      .map((option) => {
        const parsed = this.searchRegex.exec(option);
        return parsed && parsed.groups ? parsed.groups : {};
      })
      .reduce((acc, groups) => ({
        ...acc,
        ...this.removeUndefined(groups),
      })) as Parameters<IssuesService['getIssuesByProject']>[1];
  }

  private removeUndefined<T>(obj: T) {
    for (const k in obj) if (obj[k] === undefined) delete obj[k];
    return obj as Required<T>;
  }

  private addIssue(
    title: string,
    description: string,
    assignee: string,
    priority: Priority,
    status: number
  ) {
    return this.issueService.createIssue(
      this.projectID,
      title,
      description,
      assignee,
      priority,
      status
    );
  }

  private updateIssueList() {
    this.subs.sink = this.issueService
      .getIssuesByProject(this.projectID, this.removeUndefined(this.options))
      .subscribe((issues) => {
        if (this.project) {
          this.project.issues = issues;
          this.cdRef.markForCheck();
        }
      });
  }
}
