import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderModule } from 'ngx-order-pipe';
import { SharedModule } from 'shared/shared.module';
import { CreateIssueComponent } from './components/create-issue/create-issue.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { HeaderComponent } from './components/header/header.component';
import { IssueViewComponent } from './components/issue-view/issue-view.component';
import { IssueComponent } from './components/issue/issue.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { ListComponent } from './components/list/list.component';
import { MarkdownEditorComponent } from './components/markdown-editor/markdown-editor.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { UsersComponent } from './components/users/users.component';
import { ProjectGuardService } from './guards/project.guard';
import { MarkdownPipe } from './pipes/markdown.pipe';
import { StripMarkdownPipe } from './pipes/strip-markdown.pipe';
import { ProjectsRoutingModule } from './projects-routing.module';
import { IssuesService } from './services/issues.service';
import { MarkdownService } from './services/markdown.service';
import { ProjectsService } from './services/projects.service';
import { UsersService } from './services/users.service';

@NgModule({
  declarations: [
    ProjectsComponent,
    KanbanComponent,
    HeaderComponent,
    IssueComponent,
    ListComponent,
    CreateProjectComponent,

    UsersComponent,

    IssueViewComponent,

    CreateIssueComponent,

    MarkdownEditorComponent,

    MarkdownPipe,

    StripMarkdownPipe,
  ],
  providers: [
    ProjectGuardService,
    ProjectsService,
    IssuesService,
    MarkdownService,
    UsersService,
    {
      provide: MatDialogRef,
      useValue: {},
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {},
    },
    {
      provide: MatSnackBarRef,
      useValue: {},
    },
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
    MatSnackBarModule,
    DragDropModule,
    MatMenuModule,
    MatListModule,
    OrderModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
  ],
})
export class ProjectsModule {}
