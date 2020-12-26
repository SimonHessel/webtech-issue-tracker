import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo, mergeMap, tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { Me } from '../models/me.model';
import { Router } from '@angular/router';

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

  public logout() {
    this.token = '';
    this.me = undefined;

    return this.http
      .get(`${this.apiEndpoint}/logout`, {
        withCredentials: true,
        responseType: 'text',
      })
      .pipe(tap(() => this.router.navigateByUrl('login')));
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
      .post(`${this.apiEndpoint}/register`, {
        username,
        email,
        password,
      })
      .pipe(
        mapTo(true),
        catchError((error) => throwError(error.error))
      );
  }
}
