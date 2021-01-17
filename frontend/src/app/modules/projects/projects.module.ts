import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'shared/shared.module';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { HeaderComponent } from './components/header/header.component';
import { IssueComponent } from './components/issue/issue.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { ListComponent } from './components/list/list.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { UsersComponent } from './components/users/users.component';
import { ProjectGuardService } from './guards/project.guard';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsService } from './services/projects.service';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    ProjectsComponent,
    KanbanComponent,
    HeaderComponent,
    IssueComponent,
    ListComponent,
    CreateProjectComponent,

    UsersComponent,
  ],
  providers: [
    ProjectGuardService,
    ProjectsService,
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
  ],
})
export class ProjectsModule {}
