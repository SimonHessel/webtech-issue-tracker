import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    usernameOrEmail: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(),
  });

  constructor(private snackBar: MatSnackBar, private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService
      .login(
        this.loginForm.controls.usernameOrEmail.value,
        this.loginForm.controls.password.value
      )
      .subscribe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        () => this.router.navigateByUrl('/'),
        (err) => this.snackBar.open(err, "", {
        duration: 7000, 
        verticalPosition: 'top', 
        panelClass: ["snackBar-custom-style"]
        })
      );
  }
}
