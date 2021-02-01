/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */

import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MarkdownService {
  markdown = from((window as any).markdown.ready) as Observable<{
    parse: (value: string) => string;
  }>;
  constructor() {}

  public parse(input: string) {
    return this.markdown.pipe(map((markdown) => markdown.parse(input)));
  }
}
