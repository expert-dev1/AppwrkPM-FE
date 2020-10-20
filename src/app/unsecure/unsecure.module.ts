import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnsecureRoutingModule } from './unsecure-routing.module';
import { UnsecureComponent } from './unsecure/unsecure.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [UnsecureComponent, LoginComponent],
  imports: [
    CommonModule,
    UnsecureRoutingModule,
    SharedModule
  ]
})
export class UnsecureModule { }
