import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private refreshTokenSubject: BehaviorSubject<
    boolean | null
  > = new BehaviorSubject<boolean | null>(null);

  constructor(public auth: AuthService, private router: Router) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('auth')) return next.handle(request);

    if (this.isRefreshing)
      return this.refreshTokenSubject.pipe(
        filter((refresh) => refresh != null),
        take(1),
        switchMap(() => next.handle(this.addToken(request)))
      );

    const expire = this.auth.getMe?.exp;
    if (expire && expire - Date.now() / 1000 < 15) {
      this.isRefreshing = true;
      return this.auth.refreshToken().pipe(
        catchError((error: Error) => {
          if (!(error instanceof HttpErrorResponse)) return throwError(error);
          return this.auth
            .logout()
            .pipe(tap((urlTree) => this.router.navigateByUrl(urlTree)));
        }),
        switchMap(() => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(true);
          return next.handle(this.addToken(request));
        })
      );
    }

    return next.handle(this.addToken(request));
  }

  private addToken(request: HttpRequest<unknown>) {
    const accessToken = this.auth.getToken;
    if (accessToken) {
      return request.clone({
        setHeaders: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return request;
  }
}
