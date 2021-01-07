import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'join',
  pure: true,
})
export class JoinPipe implements PipeTransform {
  transform(input: unknown[], sep = ','): string {
    return input.join(sep);
  }
}
