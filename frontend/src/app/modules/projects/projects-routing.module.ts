import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueComponent } from './components/issue/issue.component';
import { ListComponent } from './components/list/list.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectGuardService } from './guards/project.guard';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    pathMatch: 'full',
  },
  {
    path: ':id',
    canActivate: [ProjectGuardService],
    children: [
      {
        path: 'kanban',
        component: KanbanComponent,
      },
      {
        path: 'issues',
        component: ListComponent,
      },
      {
        path: 'issues/:issueID',
        component: IssueComponent,
      },
      { path: 'users', component: UsersComponent },

      {
        path: '**',
        redirectTo: 'kanban',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
