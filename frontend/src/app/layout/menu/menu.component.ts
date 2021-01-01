import { Component, OnInit } from '@angular/core';
import { AuthService } from 'core/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  avatar = '';
  constructor(private readonly auth: AuthService) {}

  ngOnInit(): void {
    this.avatar = this.auth.getMe?.username.charAt(0).toLocaleUpperCase() || '';
  }
}
