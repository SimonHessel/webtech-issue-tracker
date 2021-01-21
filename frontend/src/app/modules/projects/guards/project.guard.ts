import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'core/services/auth.service';

@Injectable()
export class ProjectGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    const { id } = route.params;
    if (!id) return this.router.parseUrl('/projects');

    const projects = this.auth.getMe?.projects;
    if (!projects) return this.router.parseUrl('/projects');

    return projects.some((projectId) => projectId === id)
      ? true
      : this.router.parseUrl('/projects');
  }
}
