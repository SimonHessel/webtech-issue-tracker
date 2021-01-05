import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
 */
@Pipe({ name: 'description' })
export class DescriptionPipe implements PipeTransform {
  constructor() {}

  transform(description: string, maxLength: number): string {
    if (description.length > maxLength) {
      //trim the string to the maximum length
      const trimmedString = description.substr(0, maxLength);

      //re-trim if we are in the middle of a word
      return (
        trimmedString.substr(
          0,
          Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))
        ) + '...'
      );
    }
    return description;
  }
}
