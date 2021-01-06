import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectGuardService } from './guards/project.guard';
import { KanbanComponent } from './components/kanban/kanban.component';
import { HeaderComponent } from './components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProjectsService } from './services/projects.service';
import { IssueComponent } from './components/issue/issue.component';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from 'shared/shared.module';
import { CreateProjectComponent } from './components/create-project/create-project.component';

import { DescriptionPipe } from 'shared/pipes/description.pipe';
import { UsersComponent } from './components/users/users.component';
@NgModule({
  declarations: [
    ProjectsComponent,
    KanbanComponent,
    HeaderComponent,
    IssueComponent,
    ListComponent,
    CreateProjectComponent,
    DescriptionPipe,
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
  ],
})
export class ProjectsModule {}
