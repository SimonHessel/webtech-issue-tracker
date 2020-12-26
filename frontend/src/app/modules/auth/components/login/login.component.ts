import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService
      .login(
        this.loginForm.controls.usernameOrEmail.value,
        this.loginForm.controls.password.value
      )
      .subscribe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (res) => this.router.navigateByUrl('/'),
        (err) => window.alert(err)
      );
  }
}
