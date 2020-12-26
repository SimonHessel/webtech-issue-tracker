import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectGuardService } from './guards/project.guard';

@NgModule({
  declarations: [ProjectsComponent],
  providers: [ProjectGuardService],
  imports: [CommonModule, ProjectsRoutingModule],
})
export class ProjectsModule {}
