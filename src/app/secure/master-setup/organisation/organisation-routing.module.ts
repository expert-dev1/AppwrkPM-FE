import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PERMISSIONS } from 'src/app/core/modals/permission-model';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { OrganisationListComponent } from './organisation-list/organisation-list.component';
import { OrganizationMasterComponent } from './organization-master/organization-master.component';

const routes: Routes = [
  {
    path: '',
    component: OrganisationListComponent,
    canActivate: [AuthGuard],
    data: {
      role: PERMISSIONS.ORGANIZATION
    }
  },
  {
    path: ':action/:id', 
    component: OrganizationMasterComponent,
    canActivate: [AuthGuard],
    data: {
      role: PERMISSIONS.ORGANIZATION
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationRoutingModule { }
