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
import { OrganizationCalenderComponent } from './organization-calender/organization-calender.component';
import { AddEditCalendarEventComponent } from './add-edit-calendar-event/add-edit-calendar-event.component';
import { OrganizationEventListComponent } from './organization-event-list/organization-event-list.component';
import { SkillMasterListComponent } from './skill-master-list/skill-master-list.component';
import { SkillMasterComponent } from './skill-master/skill-master.component';


@NgModule({
  declarations: [RoleListComponent, RoleMasterComponent, EmployeeListComponent, EmployeeMasterComponent, DesignationListComponent, DesignationMasterComponent, OrganizationCalenderComponent, AddEditCalendarEventComponent, OrganizationEventListComponent, SkillMasterListComponent, SkillMasterComponent],
  imports: [
    CommonModule,
    MasterSetupRoutingModule,
    SharedModule,
  ],
  entryComponents: [
    RoleMasterComponent,
    EmployeeMasterComponent,
    DesignationMasterComponent,
    AddEditCalendarEventComponent,
    OrganizationEventListComponent
  ],
})
export class MasterSetupModule { }
