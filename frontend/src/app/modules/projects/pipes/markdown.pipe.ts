import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { MarkdownService } from '../services/markdown.service';

@Pipe({
  name: 'markdown',
  pure: true,
})
export class MarkdownPipe implements PipeTransform {
  constructor(
    protected sanitizer: DomSanitizer,
    protected readonly markdownService: MarkdownService
  ) {}

  transform(value: string | undefined): Observable<SafeHtml> {
    // const unsanitizedHtml = marked(value);
    return !value
      ? of('')
      : this.markdownService.parse(value).pipe(
          map((unsanitizedHtml) => {
            const sanitizedHtml = this.sanitizer.sanitize(
              SecurityContext.HTML,
              unsanitizedHtml
            );

            return sanitizedHtml
              ? this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml)
              : '';
          })
        );
  }
}
