import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from 'core/enums/priority.enum';
@Pipe({
  name: 'priority',
  pure: true,
})
export class PriorityPipe implements PipeTransform {
  transform(input: number | undefined): string {
    return input !== undefined ? Priority[input] : 'Priority undefined';
  }
}
