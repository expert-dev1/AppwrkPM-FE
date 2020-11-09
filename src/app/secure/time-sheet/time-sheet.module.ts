import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeSheetRoutingModule } from './time-sheet-routing.module';
import { EmployeeTimeSheetComponent } from './employee-time-sheet/employee-time-sheet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddEditEmployeeTimeSheetComponent } from './add-edit-employee-time-sheet/add-edit-employee-time-sheet.component';
import { TimeSheetStatusChangeComponent } from './time-sheet-status-change/time-sheet-status-change.component';


@NgModule({
  declarations: [EmployeeTimeSheetComponent, AddEditEmployeeTimeSheetComponent, TimeSheetStatusChangeComponent],
  imports: [
    CommonModule,
    TimeSheetRoutingModule,
    SharedModule
  ],
  entryComponents: [AddEditEmployeeTimeSheetComponent]
})
export class TimeSheetModule { }
