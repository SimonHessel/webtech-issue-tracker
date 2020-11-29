import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ AuthService ]
})

export class LoginComponent {

  loginForm = new FormGroup({
    usernameOrEmail: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl()
  });

  constructor(private authService: AuthService){
  }

  onSubmit(){
    this.authService.login(this.loginForm.controls.usernameOrEmail.value, this.loginForm.controls.password.value).subscribe();
    };
}





