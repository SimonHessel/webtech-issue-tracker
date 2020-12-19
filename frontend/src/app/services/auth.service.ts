import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mapTo, mergeMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiEndpoint = 'auth';
  constructor(private http: HttpClient) {}

  public login(usernameOrEmail: string, password: string): Observable<unknown> {
    return this.http
      .post(`${this.apiEndpoint}/login`, {
        usernameOrEmail,
        password,
      })
      .pipe(
        mapTo(true),
        catchError((error) => throwError(error.error))
      );
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
