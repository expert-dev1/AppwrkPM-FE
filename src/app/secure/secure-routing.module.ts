import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecureComponent } from './secure/secure.component';

const routes: Routes = [
  {
    path: '', component: SecureComponent, 
    children: [
      {
        path: 'shared',
        loadChildren: () => import('../shared/shared.module').then(m => m.SharedModule)
      },
      {
        path: 'masterSetup',
        loadChildren: () => import('../secure/master-setup/master-setup.module').then(m => m.MasterSetupModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
