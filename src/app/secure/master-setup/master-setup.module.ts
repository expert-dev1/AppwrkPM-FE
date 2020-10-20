import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterSetupRoutingModule } from './master-setup-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleMasterComponent } from './role-master/role-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { DesignationMasterComponent } from './designation-master/designation-master.component';


@NgModule({
  declarations: [RoleListComponent, RoleMasterComponent, EmployeeListComponent, EmployeeMasterComponent, DesignationListComponent, DesignationMasterComponent],
  imports: [
    CommonModule,
    MasterSetupRoutingModule,
    SharedModule
  ],
  entryComponents: [
    RoleMasterComponent,
    EmployeeMasterComponent,
    DesignationMasterComponent
  ],
})
export class MasterSetupModule { }
