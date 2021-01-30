import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Priority } from 'core/enums/priority.enum';
import { Project } from 'core/models/project.model';

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateIssueComponent implements OnInit {
  public description = '';
  public issueForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    // description: new FormControl('', [Validators.required]),
    assignee: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<CreateIssueComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      project: Project;
      title: string;
      description: string;
      assignee: string;
      priority: Priority;
      status: number;
    }
  ) {}

  get title() {
    return this.issueForm.controls.title.value;
  }

  setDescription(value: string) {
    this.description = value;
  }

  get assignee() {
    return this.data.assignee;
  }
  get priority() {
    return this.data.priority;
  }
  get status() {
    return this.data.status;
  }

  save(): void {
    this.dialogRef.close({
      title: this.title,
      description: this.description,
      assignee: this.assignee,
      priority: this.priority,
      status: this.status,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
