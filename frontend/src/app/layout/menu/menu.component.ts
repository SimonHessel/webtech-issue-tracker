import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'core/services/auth.service';
import { filter, startWith } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  avatar = '';
  isShown = false;
  id = '';
  projectsIDRegex = new RegExp(/\/projects\/(?<id>\d+)(\/.*)?/);
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.avatar = this.auth.getMe?.username.charAt(0).toLocaleUpperCase() || '';
    this.subs.sink = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(false)
      )
      .subscribe(() => {
        const res = this.projectsIDRegex.exec(this.router.url);
        this.id = res?.groups?.id ? res?.groups?.id : '';
        this.isShown = !!this.id;
      });
  }

  public logOut() {
    console.log('works');
    this.auth
      .logout()
      .subscribe((urltree) => this.router.navigateByUrl(urltree));
  }
}
