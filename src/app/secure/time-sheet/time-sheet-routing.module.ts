import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PERMISSIONS } from 'src/app/core/modals/permission-model';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { UnsavedChangesGuard } from 'src/app/shared/guards/unsaved-changes-guard';
import { EmployeeTimeSheetComponent } from './employee-time-sheet/employee-time-sheet.component';
import { TimeSheetStatusChangeComponent } from './time-sheet-status-change/time-sheet-status-change.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'employeeTimeSheet',
        component: EmployeeTimeSheetComponent,
        canActivate: [AuthGuard],
        canDeactivate: [UnsavedChangesGuard],
        data: {
          role: PERMISSIONS.EMPLOYEE_TIME_SHEET
        }
      },
      {
        path: 'statusChange',
        component: TimeSheetStatusChangeComponent,
        canActivate: [AuthGuard],
        canDeactivate: [UnsavedChangesGuard],
        data: {
          role: PERMISSIONS.TIME_SHEET_STATUS_CAHNGE
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeSheetRoutingModule { }
