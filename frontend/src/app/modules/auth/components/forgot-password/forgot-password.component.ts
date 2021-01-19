import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm = new FormGroup({
    usernameOrEmail: new FormControl('', [Validators.required]),
  })
  constructor() { }

  onSubmit(){
    console.log(`successful`)
  }
  ngOnInit(): void {
  }

}
