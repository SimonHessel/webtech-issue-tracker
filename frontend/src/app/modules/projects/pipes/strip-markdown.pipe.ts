import { Pipe, PipeTransform } from '@angular/core';

import RemoveMarkdown from 'remove-markdown';

@Pipe({
  name: 'stripMarkdown',
})
export class StripMarkdownPipe implements PipeTransform {
  transform(value: string | undefined): string {
    return value ? RemoveMarkdown(value) : '';
  }
}
