import { Component, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

@Component({ template: '' })
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class UnsubscribeOnDestroyAdapter implements OnDestroy {
  /**The subscription sink object that stores all subscriptions */
  subs = new SubSink();
  /**
   * The lifecycle hook that unsubscribes all subscriptions
   * when the component / object gets destroyed
   */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
