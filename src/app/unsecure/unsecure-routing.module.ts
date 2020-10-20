import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UnsecureComponent } from './unsecure/unsecure.component';

const routes: Routes = [
  {
    path: "", component: UnsecureComponent, children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: "login",
        component: LoginComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnsecureRoutingModule { }
