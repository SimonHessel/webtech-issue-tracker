import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeOnDestroyAdapter } from './utils/UnsubscribeOnDestroyAdapter';

@NgModule({
  declarations: [UnsubscribeOnDestroyAdapter],
  imports: [CommonModule],
  exports: [UnsubscribeOnDestroyAdapter],
})
export class SharedModule {}
