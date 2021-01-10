import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'core/services/auth.service';
import { filter, startWith } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from 'shared/utils/UnsubscribeOnDestroyAdapter';
import { MediaObserver } from '@angular/flex-layout';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  public username = '';
  public isShown = false;
  public id = '';
  private readonly projectsIDRegex = new RegExp(
    /\/projects\/(?<id>\d+)(\/.*)?/
  );
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    public media: MediaObserver,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.username = this.auth.getMe?.username || '';
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

  public getIcon(open: boolean) {
    return open ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
  }

  public logOut() {
    this.auth
      .logout()
      .subscribe((urltree) => this.router.navigateByUrl(urltree));
  }
}
