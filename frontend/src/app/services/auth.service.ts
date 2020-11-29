import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public login(usernameOrEmail: string, password: string): Observable<unknown> {
    const user = {
      username: usernameOrEmail.includes('@') ? '' : usernameOrEmail,
      email: usernameOrEmail.includes('@') ? '' : usernameOrEmail,
    };
    return of(user).pipe(
      mergeMap((_) =>
        password === '123'
          ? throwError('Password or username incorrect')
          : of(user)
      )
    );
  }
}
