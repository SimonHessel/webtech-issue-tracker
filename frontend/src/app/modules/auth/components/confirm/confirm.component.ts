import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'core/services/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {

    const verificationToken = this.route.snapshot.paramMap.get('token');

    if(!verificationToken){throw new Error('no token');}

    this.subs.sink = this.authService.confirmPassword(
      verificationToken
    )
    .subscribe(
      (_) => {
        const message = document.getElementById('successMessage');
        if(!message)
        {
          throw new Error('element is null');
        }
        else
        {
          message.hidden = false;
        }
      },
      (_err) => {
        const message = document.getElementById('failureMessage');
        if(!message){
          throw new Error('element is null');
        }
        else{
          message.hidden = false;
        }
      }
    );
  }

}
