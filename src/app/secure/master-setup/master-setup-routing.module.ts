import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PERMISSIONS } from 'src/app/core/modals/permission-model';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { OrganizationCalenderComponent } from './organization-calender/organization-calender.component';
import { RoleListComponent } from './role-list/role-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'roles',
        component: RoleListComponent,
        canActivate: [AuthGuard],
        data: {
          role: PERMISSIONS.ROLE_MASTER
        }
      },
      {
        path: 'employee',
        component: EmployeeListComponent,
        canActivate: [AuthGuard],
        data: {
          role: PERMISSIONS.EMPLOYEE
        }
      },
      {
        path: 'designation',
        component: DesignationListComponent,
        canActivate: [AuthGuard],
        data: {
          role: PERMISSIONS.DESIGNATION
        }
      },
      {
        path: 'organizationCalender',
        component: OrganizationCalenderComponent,
        canActivate: [AuthGuard],
        data: {
          role: PERMISSIONS.ORGANIZATION_CALENDAR
        }
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'organisation',
        loadChildren: () => import('./organisation/organisation.module').then(m => m.OrganisationModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSetupRoutingModule { }
