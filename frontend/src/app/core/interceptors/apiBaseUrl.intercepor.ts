import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiBaseUrlInterceptor implements HttpInterceptor {
  constructor(
    @Inject('API_BASE_DOMAIN') private apiBaseDomain: string,
    @Inject('HTTPS') private https: boolean
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const apiReq = req.clone({
      url: `${this.https ? 'https://' : 'http://'}${this.apiBaseDomain}/api/${
        req.url
      }`,
    });

    return next.handle(apiReq);
  }
}
