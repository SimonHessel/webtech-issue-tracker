import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'core/models/issue.model';
import { Project } from 'core/models/project.model';
import { IssuesService } from 'modules/projects/services/issues.service';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { of } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  project: Project | undefined = undefined;
  projectID = '';
  currentIssue: Issue | undefined = undefined;
  searchDefault = '';

  private readonly searchRegex = new RegExp(
    /(assignee=(?<assignee>\w+)|priority=(?<priority>\d+)|status=(?<status>\d+)|(?<search>\w+))/
  );

  constructor(
    private route: ActivatedRoute,
    private readonly projectService: ProjectsService,
    private readonly issueService: IssuesService,
    private readonly cdRef: ChangeDetectorRef
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

  public search(value: string) {
    const options = this.parseSearchQuery(value);

    this.issueService
      .getIssuesByProject(this.projectID, this.removeUndefined(options))
      .subscribe((issues) => {
        if (this.project) {
          this.project.issues = issues;
          this.cdRef.markForCheck();
        }
      });
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
}
