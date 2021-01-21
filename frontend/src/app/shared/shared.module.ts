import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeOnDestroyAdapter } from './utils/UnsubscribeOnDestroyAdapter';
import { DescriptionPipe } from './pipes/description.pipe';
import { JoinPipe } from './pipes/join.pipe';
import { AvatarPipe } from './pipes/avatar.pipe';
import { DirectionPipe } from './pipes/direction.pipe';
import { PriorityPipe } from './pipes/priority.pipe';

const declarations = [
  UnsubscribeOnDestroyAdapter,
  DescriptionPipe,
  JoinPipe,
  AvatarPipe,
  DirectionPipe,
  PriorityPipe,
];
@NgModule({
  declarations,
  imports: [CommonModule],
  exports: declarations,
})
export class SharedModule {}
