import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mapTo, mergeMap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import { Me } from '../models/me.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiEndpoint = 'auth';
  private refreshed = false;
  private token = '';
  private me: Me | undefined = undefined;
  constructor(private http: HttpClient) {}

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
  }

  get getMe(): Me | undefined {
    return this.me;
  }
  get getToken(): string {
    return this.token;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public refreshToken(): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http
      .get(`${this.apiEndpoint}/refresh`, {
        withCredentials: true,
        responseType: 'text',
      })
      .pipe(mapTo(true));
    // .pipe(tap(({accessToken}: Token) => this.setToken(accessToken)));
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
