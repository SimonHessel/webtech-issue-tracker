import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectGuardService } from './guards/project.guard';
import { KanbanComponent } from './components/kanban/kanban.component';
import { HeaderComponent } from './components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectsService } from './services/projects.service';
@NgModule({
  declarations: [ProjectsComponent, KanbanComponent, HeaderComponent],
  providers: [ProjectGuardService, ProjectsService],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ProjectsModule {}
