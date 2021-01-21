import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'core/services/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';



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
    
  })

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  onSubmit = () => {
    console.log("success");
  }
  ngOnInit(): void {
  }

}
