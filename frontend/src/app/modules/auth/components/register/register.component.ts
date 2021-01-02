import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = new FormGroup({
    eMail: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private snackBar: MatSnackBar, private authService: AuthService ){}
  onSubmit = () => {
    this.authService.register(
      this.registerForm.controls.eMail.value,
      this.registerForm.controls.username.value,
      this.registerForm.controls.password.value
    ).subscribe();
    /*
    console.log(this.registerForm.controls.eMail.value);
    console.log(this.registerForm.controls.username.value);
    console.log(this.registerForm.controls.password.value);
    */
  };
}
