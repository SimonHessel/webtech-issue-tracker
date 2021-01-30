import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as marked from 'marked';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownEditorComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  @ViewChild('text', { static: true })
  text!: ElementRef<HTMLDivElement>;
  previewHtml: SafeHtml | undefined;

  constructor(
    private readonly domSanitizer: DomSanitizer,

    private readonly cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.subs.sink = fromEvent(this.text.nativeElement, 'keyup')
      .pipe(
        map(
          (event) =>
            (event as KeyboardEvent & { target: HTMLDivElement }).target
              .innerText
        ),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((text) => {
        const unsanitizedHtml = marked(text);
        const sanitizedHtml = this.domSanitizer.sanitize(
          SecurityContext.HTML,
          unsanitizedHtml
        );
        if (sanitizedHtml) {
          this.previewHtml = this.domSanitizer.bypassSecurityTrustHtml(
            sanitizedHtml
          );
          console.log(this.previewHtml);
        }
      });
  }
}
