import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent extends UnsubscribeOnDestroyAdapter {
  resetPasswordForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  hide = true;

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  onSubmit = () => {
    if (
      this.resetPasswordForm.controls.newPassword.value !==
      this.resetPasswordForm.controls.confirmPassword.value
    ) {
      this.snackBar.open('Passwords do not match', '', {
        duration: 7000,
        verticalPosition: 'top',
      });
      return;
    }

    const randomtoken = this.route.snapshot.paramMap.get('token');
    if (!randomtoken) throw new Error('Project guard malfunction');

    this.subs.sink = this.authService
      .resetPassword(
        this.resetPasswordForm.controls.newPassword.value,
        randomtoken
      )
      .subscribe(
        (_) => {
          this.snackBar.open(
            'Reset was successfull, Login with your new Password',
            '',
            {
              duration: 10000,
              verticalPosition: 'top',
            }
          );
          this.router.navigateByUrl('/');
        },
        (error) => {
          this.snackBar.open(error, '', {
            duration: 10000,
            verticalPosition: 'top',
          });
          this.router.navigateByUrl('/');
        }
      );
  };
}
