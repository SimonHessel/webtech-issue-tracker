import { Clipboard } from '@angular/cdk/clipboard';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Project } from 'core/models/project.model';
import { ProjectsService } from 'modules/projects/services/projects.service';
import { throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
import { CreateProjectComponent } from '../create-project/create-project.component';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent
  extends UnsubscribeOnDestroyAdapter
  implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'issues', 'other'];
  dataSource = new MatTableDataSource<Project>([]);
  length = 0;
  currentSearch = '';

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.search = this.search.bind(this);
    this.projectsService.projects.subscribe((projects) => {
      this.dataSource.data = projects;
      this.length = projects.length + 1;
      this.cdRef.markForCheck();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.subs.sink = this.paginator.page
      .pipe(
        tap((pageEvent: PageEvent) => {
          if (
            pageEvent.previousPageIndex &&
            pageEvent.previousPageIndex > pageEvent.pageIndex
          )
            return;

          const options: Parameters<ProjectsService['getProjects']>[0] = {
            take: pageEvent.pageSize,
            skip: this.dataSource.data.length - 1,
          };

          if (this.currentSearch) options.search = this.currentSearch;
          this.loadProjects(options);
        })
      )
      .subscribe();
  }

  public search(value: string) {
    this.currentSearch = value;
    this.loadProjects({ search: value });
  }

  public openDialog() {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      disableClose: true,
      data: { description: '', title: '', usernames: [] },
      height: '80%',
      width: '90%',
    });

    this.subs.sink = dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) =>
          result
            ? this.addProject(
                result.description,
                result.title,
                result.usernames
              )
            : throwError(false)
        )
      )
      .subscribe(
        (data) => this.router.navigate(['./projects/', data.id]),
        (_) => {}
      );
  }

  public copy(id: Project['id']) {
    this.clipboard.copy(`${window.location.host}${this.router.url}/${id}`);
    this.snackBar.open(
      $localize`:@@linkhasbeencopied:Link has been copied`,
      '',
      {
        duration: 2500,
      }
    );
  }

  public deleteProject(projectId: Project['id']) {
    const snackBarRef = this.snackBar.open(
      $localize`:@@projectdelete:Project has been deleted`,
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
            : this.projectsService.deleteProject(projectId)
        )
      )
      .subscribe();
  }

  public trackById(_: number, project: Project): Project['id'] {
    return project.id;
  }
  private addProject(description: string, title: string, usernames: string[]) {
    return this.projectsService.addProject(description, title, usernames);
  }

  private loadProjects(options: Parameters<ProjectsService['getProjects']>[0]) {
    this.subs.sink = this.projectsService.loadProjects(options).subscribe();
  }
}
