import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'direction',
  pure: true,
})
export class DirectionPipe implements PipeTransform {
  transform(input: boolean): string {
    return input ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
  }
}
