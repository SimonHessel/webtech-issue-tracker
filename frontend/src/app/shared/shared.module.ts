import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeOnDestroyAdapter } from './utils/UnsubscribeOnDestroyAdapter';
import { DescriptionPipe } from './pipes/description.pipe';
import { JoinPipe } from './pipes/join.pipe';

@NgModule({
  declarations: [UnsubscribeOnDestroyAdapter, DescriptionPipe, JoinPipe],
  imports: [CommonModule],
  exports: [UnsubscribeOnDestroyAdapter, DescriptionPipe, JoinPipe],
})
export class SharedModule {}
