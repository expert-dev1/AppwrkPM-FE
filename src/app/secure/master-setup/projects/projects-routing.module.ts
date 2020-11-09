import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { AddEditProjectComponent } from './add-edit-project/add-edit-project.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { PERMISSIONS } from 'src/app/core/modals/permission-model';

const routes: Routes = [
  {
    path: '',
    component: ProjectListComponent,
    canActivate: [AuthGuard],
    data: {
      role: PERMISSIONS.PROJECT
    }
  },
  {
    path: ':action/:id',
    component: AddEditProjectComponent,
    canActivate: [AuthGuard],
    data: {
      role: PERMISSIONS.PROJECT
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
