import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.isloggedIn().pipe(
      catchError((err) =>
        this.auth.logout().pipe(mapTo(this.router.parseUrl('/auth/login')))
      ),
      map((isAuthenticated) => {
        if (!isAuthenticated && state.url !== '/auth/login')
          return this.router.parseUrl('/auth/login');
        else if (isAuthenticated && state.url === '/auth/login')
          return this.router.parseUrl('');
        return true;
      })
    );
  }
}
