import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('textarea', { static: true })
  public textArea!: ElementRef<HTMLTextAreaElement>;
  @Output() public description = new EventEmitter<string>();

  @Input() public text = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.subs.sink = fromEvent(this.textArea.nativeElement, 'keyup')
      .pipe(
        map(
          (event) =>
            (event as KeyboardEvent & { target: HTMLTextAreaElement }).target
              .value
        ),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text) => {
        this.text = text;
        this.description.emit(text);
      });
  }
}
