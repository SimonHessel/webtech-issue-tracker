/* eslint-disable @typescript-eslint/member-ordering */
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Priority } from 'core/enums/priority.enum';
import { Issue } from 'core/models/issue.model';
import { Project } from 'core/models/project.model';
import { IssuesService } from 'modules/projects/services/issues.service';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { Observable, throwError } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
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
  separatorKeysCodes: number[] = [ENTER, SPACE];
  formControl = new FormControl();
  filteredItems: Observable<string[]>;
  items: string[] = [];
  totalItems: string[] = [];

  priorties: string[] = Object.keys(Priority)
    .map((key) => Priority[(key as unknown) as number])
    .filter((value) => typeof value === 'string');

  @ViewChild('itemInput', { static: false })
  itemInput!: ElementRef<HTMLInputElement>;

  @ViewChild('auto', { static: false }) matAutocomplete!: MatAutocomplete;

  public project: Project | undefined = undefined;
  public projectID = '';
  public currentIssue: Issue | undefined = undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly projectService: ProjectsService,
    private readonly issueService: IssuesService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly dialog: MatDialog
  ) {
    super();

    this.filteredItems = this.formControl.valueChanges.pipe(
      startWith(null),
      map((item: string | null) =>
        item ? this.filter(item) : this.totalItems.slice()
      )
    );
  }

  ngOnInit(): void {
    this.projectID = this.route.snapshot.paramMap.get('id') || '';

    this.items = Object.values(this.route.snapshot.queryParams).filter(
      (item) => !!item
    );

    this.subs.sink = this.projectService
      .setCurrentProject(this.projectID, {
        fetchIssues: false,
      })
      .subscribe();

    this.subs.sink = this.projectService.current
      .pipe(
        filter((project) => !!project),
        distinctUntilChanged()
      )
      .subscribe((project) => {
        console.log('now');
        this.project = project;
        this.lifecycleUpdate();

        this.cdRef.markForCheck();
      });
  }

  lifecycleUpdate() {
    if (this.project && this.project.users && this.project.states) {
      const users = this.project.users.map((user) => user.username);
      const dropdownOptions: string[] = [];
      const emptyArray: string[] = [];
      const options: Parameters<this['refreshIssueList']>[0] = {};
      const queryParams: {
        [key in keyof Parameters<this['refreshIssueList']>[0]]?: string;
      } = {};

      let setUsers = true;
      let setStates = true;
      let setPriorities = true;
      for (const item of this.items) {
        if (setUsers && users.includes(item)) {
          options.assignee = item;
          setUsers = false;
          queryParams.assignee = item;
        } else if (setStates && this.project.states.includes(item)) {
          options.status = this.project.states.indexOf(item);
          queryParams.status = item;
          setStates = false;
        } else if (setPriorities && this.priorties.includes(item)) {
          options.priority = (Priority[
            (item as unknown) as number
          ] as unknown) as number;
          queryParams.priority = item;
          setPriorities = false;
        } else if (
          !(
            users.includes(item) &&
            this.project.states.includes(item) &&
            this.priorties.includes(item)
          )
        ) {
          queryParams.search = item;
          options.search = item;
        }
      }

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
      });

      this.refreshIssueList(options);

      this.totalItems = dropdownOptions.concat(
        setUsers ? users : emptyArray,
        setStates ? this.project.states : emptyArray,
        setPriorities ? this.priorties : emptyArray
      );
    }
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.items.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.formControl.setValue(null);
      this.lifecycleUpdate();
    }
  }

  remove(item: string): void {
    const index = this.items.indexOf(item);

    if (index >= 0) {
      this.items.splice(index, 1);
    }
    this.lifecycleUpdate();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.items.push(event.option.viewValue);
    this.itemInput.nativeElement.value = '';
    this.formControl.setValue(null);
    this.lifecycleUpdate();
  }

  public filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.totalItems.filter(
      (item) => item.toLowerCase().indexOf(filterValue) === 0
    );
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
      .subscribe(() => this.lifecycleUpdate());
  }

  public updateIssue(issue: Issue) {
    if (this.project) {
      this.project.issues = this.project.issues?.map((i) =>
        i.id === issue.id ? issue : i
      );
    }
    this.cdRef.markForCheck();
  }

  public toggleSelectedIssue(issue: Issue) {
    this.currentIssue = issue;
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

  refreshIssueList(
    options: Exclude<
      Parameters<IssuesService['getIssuesByProject']>[1],
      undefined
    >
  ) {
    this.subs.sink = this.issueService
      .getIssuesByProject(this.projectID, options)
      .subscribe((issues) => {
        if (this.project) {
          this.project.issues = issues;
          this.cdRef.markForCheck();
        }
      });
  }
}
