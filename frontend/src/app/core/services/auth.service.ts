import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';
import { Me } from '../models/me.model';

@Injectable()
export class AuthService {
  private apiEndpoint = 'auth';
  private refreshed = false;
  private token = '';
  private me: Me | undefined = undefined;
  constructor(private http: HttpClient, private router: Router) {}

  public login(usernameOrEmail: string, password: string): Observable<unknown> {
    return this.http
      .post(
        `${this.apiEndpoint}/login`,
        {
          usernameOrEmail,
          password,
        },
        { withCredentials: true }
      )
      .pipe(
        mapTo(true),
        catchError((error) => throwError(error.error))
      );
  }

  public updateToken(token: string) {
    this.token = token;
    this.me = jwtDecode(token);
  }

  isloggedIn(): Observable<boolean> {
    if (this.refreshed) {
      return of(!!this.token);
    } else {
      this.refreshed = true;

      return this.refreshToken().pipe(mapTo(true));
    }
  }

  public logout(): Observable<UrlTree> {
    this.token = '';
    this.me = undefined;

    return this.http
      .get(`${this.apiEndpoint}/logout`, {
        withCredentials: true,
        responseType: 'text',
      })
      .pipe(map(() => this.router.parseUrl('/auth/login')));
  }

  get getMe(): Me | undefined {
    return this.me;
  }
  get getToken(): string {
    return this.token;
  }

  public refreshToken() {
    return this.http.get(`${this.apiEndpoint}/refresh`, {
      withCredentials: true,
      responseType: 'text',
    });
  }

  public register(
    username: string,
    email: string,
    password: string
  ): Observable<unknown> {
    return this.http
      .post(
        `${this.apiEndpoint}/register`,
        {
          username,
          email,
          password,
        },
        {
          responseType: 'text',
        }
      )
      .pipe(catchError((error) => throwError(error.error)));
  }

  public requestForgotPasswordMail(
    usernameOrEmail: string
  ): Observable<unknown> {
    return this.http
      .post(
        `${this.apiEndpoint}/${usernameOrEmail}`,
        {
          usernameOrEmail,
        },
        {
          responseType: 'text',
        }
      )
      .pipe(catchError((error) => throwError(error.error)));
  }

  public resetPassword(
    newPassword: string,
    verificationToken: string
  ): Observable<unknown> {
    return this.http
      .post(
        `${this.apiEndpoint}/passwordreset/${verificationToken}`,
        {
          newPassword,
        },
        {
          responseType: 'text',
        }
      )
      .pipe(catchError((error) => throwError(error.error)));
  }

  public confirmPassword(verificationToken: string): Observable<unknown> {
    return this.http
      .post(
        `${this.apiEndpoint}/confirm/${verificationToken}`,
        {},
        {
          responseType: 'text',
        }
      )
      .pipe(
        mapTo(true),
        catchError((error) => throwError(error.error))
      );
  }
}
