import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

  });

  private token = this.route.snapshot.paramMap.get('token');

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  onSubmit = () => {
    if(this.resetPasswordForm.controls.newPassword.value !== this.resetPasswordForm.controls.confirmPassword.value){
      this.snackBar.open('Passwords do not match', '', {
        duration: 7000,
        verticalPosition: 'top',
      });
    };

    console.log(`success ${this.token}`);
  };
  ngOnInit(): void {
  }

}
