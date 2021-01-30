import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import marked from 'marked';

@Pipe({
  name: 'markdown',
  pure: true,
})
export class MarkdownPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}

  transform(value: string | undefined): SafeHtml {
    if (!value) return '';
    const unsanitizedHtml = marked(value);
    const sanitizedHtml = this.sanitizer.sanitize(
      SecurityContext.HTML,
      unsanitizedHtml
    );

    return sanitizedHtml
      ? this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml)
      : '';
  }
}
