import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';
import { AddEditProjectComponent} from './add-edit-project/add-edit-project.component';


@NgModule({
  declarations: [ ProjectListComponent , AddEditProjectComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule
  ]
})
export class ProjectsModule { }
