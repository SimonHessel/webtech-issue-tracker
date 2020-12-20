import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.isloggedIn().pipe(
      catchError((err) => {
        console.log(err);
        return of(false);
      }),
      map((isAuthenticated) => {
        if (!isAuthenticated && state.url !== '/login') {
          this.router.navigate(['login']);
          return false;
        } else if (isAuthenticated && state.url === '/login') {
          this.router.navigateByUrl('');
          return false;
        }
        return true;
      })
    );
  }
}
