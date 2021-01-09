import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'avatar',
  pure: true,
})
export class AvatarPipe implements PipeTransform {
  transform(input: string): string {
    return input.charAt(0).toLocaleUpperCase();
  }
}
