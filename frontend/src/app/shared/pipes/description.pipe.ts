import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'description', pure: true })
export class DescriptionPipe implements PipeTransform {
  constructor() {}

  transform(description: string | undefined, maxLength = 60): string {
    if (description) {
      if (description.length > maxLength) {
        //trim the string to the maximum length
        const trimmedString = description.substr(0, maxLength);

        console.log(Math.min(trimmedString.length));

        const lastSpacePosition = trimmedString.lastIndexOf(' ');
        //re-trim if we are in the middle of a word
        return (
          trimmedString.substr(
            0,
            lastSpacePosition > 0
              ? Math.min(trimmedString.length, lastSpacePosition)
              : trimmedString.length
          ) + '...'
        );
      }
      return description;
    }
    return 'description undefined';
  }
}
