import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

import { AuthGuardService } from './core/guards/auth.guard';
import { MenuComponent } from './layout/menu/menu.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projects',
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'auth',

        loadChildren: () =>
          import('./modules/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '',
        component: MenuComponent,
        children: [
          {
            path: 'projects',
            loadChildren: () =>
              import('./modules/projects/projects.module').then(
                (m) => m.ProjectsModule
              ),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '/projects' },
];

@NgModule({
  imports: [
    QuicklinkModule,
    RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
