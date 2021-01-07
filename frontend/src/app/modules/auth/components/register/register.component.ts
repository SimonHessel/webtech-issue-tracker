import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  onSubmit = () => {
    console.log(this.registerForm.controls.eMail.value);
    console.log(this.registerForm.controls.username.value);
    console.log(this.registerForm.controls.password.value);
  };
}
