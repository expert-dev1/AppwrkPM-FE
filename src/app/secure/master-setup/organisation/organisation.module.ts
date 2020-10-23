import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganisationRoutingModule } from './organisation-routing.module';
import { OrganisationListComponent } from './organisation-list/organisation-list.component';
import { SharedModule} from '../../../shared/shared.module';

@NgModule({
  declarations: [OrganisationListComponent],
  imports: [
    CommonModule,
    OrganisationRoutingModule,
    SharedModule
  ]
})
export class OrganisationModule { }
