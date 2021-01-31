import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'core/models/user.model';

@Injectable()
export class UsersService {
  private readonly apiEndpoint = 'users';

  constructor(private readonly http: HttpClient) {}

  public searchUsers(search: string) {
    return this.http.get<Pick<User, 'username' | 'email'>[]>(
      `${this.apiEndpoint}`,
      {
        params: new HttpParams({
          fromObject: { search },
        }),
      }
    );
  }
}
