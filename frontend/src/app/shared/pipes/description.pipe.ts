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

  transform(description: string): string {
    if (description.length > 60) {
      //trim the string to the maximum length
      let trimmedString = description.substr(0, 60);

      //re-trim if we are in the middle of a wor
      trimmedString = trimmedString.substr(
        0,
        Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))
      );
      return trimmedString + '...';
    }
    return description;
  }
}
