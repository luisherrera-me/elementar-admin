import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'register-device',
    title: 'Dialog',
    loadComponent: () => import('./register-device-dialog/register-device-dialog.component').then(c => c.RegisterDeviceDialogComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterDeviceRoutingModule { }
