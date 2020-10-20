import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { SharedModule } from '../shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { UnsaveChangesConfirmationPopupComponent } from './unsave-changes-confirmation-popup/unsave-changes-confirmation-popup.component';




@NgModule({
  declarations: [ConfirmationComponent, UnsaveChangesConfirmationPopupComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CommonModules { }
