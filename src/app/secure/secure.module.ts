import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure/secure.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [SecureComponent],
  imports: [
    SharedModule,
    CommonModule,
    SecureRoutingModule,
    
  ]
})
export class SecureModule { }
