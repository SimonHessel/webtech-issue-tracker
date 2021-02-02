import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'core/services/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({

  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends UnsubscribeOnDestroyAdapter {
  loginForm = new FormGroup({
    usernameOrEmail: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(),
  });

  hide=true;
  private count = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  onSubmit() {
    this.subs.sink = this.authService
      .login(
        this.loginForm.controls.usernameOrEmail.value,
        this.loginForm.controls.password.value
      )
      .subscribe(
        () => {
          this.snackBar.dismiss();
          this.router.navigateByUrl('/');
        },
        (err) => {
          this.snackBar.open(err, '', {
            duration: 7000,
            verticalPosition: 'top',
            panelClass: ['snackBar-custom-style'],
          });
          this.count += 1;
          if(this.count === 5){
            this.snackBar.open('Forgot your Password ? Click on the link under the login button.', '', {
              verticalPosition: 'top',
            });
            this.count = 0;
          };
        }
      );
  }
}
