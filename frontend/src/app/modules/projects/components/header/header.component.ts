/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  @Input() header = '';
  @ViewChild('search', { static: true })
  searchInput!: ElementRef;
  @Input() search: ((value: string) => void) | undefined = undefined;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.search)
      this.subs.sink = fromEvent(this.searchInput.nativeElement, 'keyup')
        .pipe(
          map(
            (event) =>
              (event as KeyboardEvent & { target: HTMLInputElement }).target
                .value
          ),

          debounceTime(500),

          distinctUntilChanged()
        )
        .subscribe(this.search);
  }
}
