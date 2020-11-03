import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { AddEditProjectComponent} from './add-edit-project/add-edit-project.component';

const routes: Routes = [
  {path: '', component: ProjectListComponent},
  {path: ':action/:id', component: AddEditProjectComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
