import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectGuardService } from './guards/project.guard';
import { KanbanComponent } from './components/kanban/kanban.component';
import { ProjectsService } from './services/projects.service';

@NgModule({
  declarations: [ProjectsComponent, KanbanComponent],
  providers: [ProjectGuardService, ProjectsService],
  imports: [CommonModule, ProjectsRoutingModule],
})
export class ProjectsModule {}
