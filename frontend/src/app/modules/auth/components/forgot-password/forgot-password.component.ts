import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'core/services/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  forgotPasswordForm = new FormGroup({
    usernameOrEmail: new FormControl('', [Validators.required]),
  });

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
    ){}

  onSubmit = () => {
    this.authService
      .requestForgotPasswordMail(
        this.forgotPasswordForm.controls.usernameOrEmail.value
      )
      .subscribe(
        (_) => {
          this.snackBar.open('Please check your Mails. ', '', {
            duration: 10000,
            verticalPosition: 'top',
            panelClass: ['snackBar-custom-style'],
          });
        },
        (err) => 
          this.snackBar.open(err, '', {
            duration: 10000,
            verticalPosition: 'top',
            panelClass: ['snackBar-custom-style'],
          })
      );
  };
}
