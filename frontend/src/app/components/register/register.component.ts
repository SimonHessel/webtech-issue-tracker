import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  registerForm = new FormGroup({
    eMail: new FormControl('', [Validators.required, Validators.email]),
    userName: new FormControl('', [Validators.required, Validators.pattern('/^[a-zA-Z0-9]+$/'), Validators.minLength(5)]),
    password: new FormControl('', [Validators.required])
  });


}
