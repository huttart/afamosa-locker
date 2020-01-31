import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManualRoutingModule } from './manual-routing.module';
import { ManualComponent } from './manual.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [ManualComponent],
  imports: [
    CommonModule,
    ManualRoutingModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class ManualModule { }
