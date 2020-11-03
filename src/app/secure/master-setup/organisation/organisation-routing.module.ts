import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisationListComponent } from './organisation-list/organisation-list.component';
import { OrganizationMasterComponent } from './organization-master/organization-master.component';

const routes: Routes = [
  {
    path: '', component: OrganisationListComponent
  },
  { 
    path: ':action/:id', component: OrganizationMasterComponent 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationRoutingModule { }
