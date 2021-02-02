import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { UsersService } from 'modules/projects/services/users.service';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  @ViewChild('userInput', { static: false })
  userInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete!: MatAutocomplete;

  separatorKeysCodes: number[] = [ENTER, SPACE];
  formControl = new FormControl();
  filteredUsers: Observable<string[]>;
  users: string[] = [];
  allUsers: string[] = [];

  public description = '';
  projectForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly usersService: UsersService,
    public dialogRef: MatDialogRef<CreateProjectComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; description: string; usernames: string[] }
  ) {
    super();
    this.filteredUsers = this.formControl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this.filter(user) : this.allUsers.slice()
      )
    );
  }

  ngOnInit(): void {
    this.subs.sink = this.usersService.searchUsers('@').subscribe((result) => {
      for (const user of result) {
        this.allUsers.push(user.username);
      }
    });
  }

  get title() {
    return this.projectForm.controls.title.value;
  }

  setDescription(value: string) {
    this.description = value;
  }

  save(): void {
    this.dialogRef.close({
      title: this.title,
      description: this.description,
      usernames: this.users,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.users.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.formControl.setValue(null);
  }

  remove(user: string): void {
    const index = this.users.indexOf(user);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.viewValue);
    this.userInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(
      (user) => user.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
