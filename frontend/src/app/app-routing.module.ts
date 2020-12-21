import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KanbanComponent } from './components/kanban/kanban.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuardService } from './guards/auth.guard';

const routes: Routes = [
  {
    canActivate: [AuthGuardService],
    path: 'login',
    component: LoginComponent,
  },
  {
    canActivate: [AuthGuardService],
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: '',
    component: MenuComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'projects',
        component: ProjectsComponent,
      },
      {
        path: 'projects/:id/kanban',
        component: KanbanComponent,
      },
      { path: '**', redirectTo: 'projects' },
    ],
  },
  { path: '**', redirectTo: '/projects' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
