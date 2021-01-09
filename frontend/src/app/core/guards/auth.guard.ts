import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.isloggedIn().pipe(
      map((isAuthenticated) => {
        console.log(isAuthenticated, state.url);
        if (!isAuthenticated && !state.url.includes('/auth/'))
          return this.router.parseUrl('/auth/login');
        else if (isAuthenticated && state.url.includes('/auth/'))
          return this.router.parseUrl('');
        return true;
      }),
      catchError(() =>
        this.auth
          .logout()
          .pipe(map((urlTree) => state.url.includes('/auth/') || urlTree))
      )
    );
  }
}
