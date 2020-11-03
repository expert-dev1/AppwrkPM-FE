import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
        component: RoleListComponent
      },
      {
        path: 'employee',
        component: EmployeeListComponent
      },
      {
        path: 'designation',
        component: DesignationListComponent
      },
      {
        path: 'organizationCalender',
        component: OrganizationCalenderComponent
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
