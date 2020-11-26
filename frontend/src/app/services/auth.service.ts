import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public login(usernameOrEmail: string, password: string): Observable<any> {
    const user = {
      username: usernameOrEmail.includes('@') ? '' : usernameOrEmail,
      email: usernameOrEmail.includes('@') ? '' : usernameOrEmail,
    };
    return of(user).pipe(
      mergeMap((user) =>
        password == '123'
          ? throwError('Password or username incorrect')
          : of(user)
      )
    );
  }
}
