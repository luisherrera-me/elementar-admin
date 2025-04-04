import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'basic',
  },
  {
    path: 'basic',
    title: 'Basic Dashboard',
    loadComponent: () => import('./basic/basic.component').then(c => c.BasicComponent)
  },
  {
    path: 'ecommerce',
    title: 'Ecommerce Dashboard',
    loadComponent: () => import('./ecommerce/ecommerce.component').then(c => c.EcommerceComponent),
    data: { renderMode: 'default' } // ❌ Evita prerendering en esta ruta
  },
  {
    path: 'finance',
    title: 'Finance Dashboard',
    loadComponent: () => import('./finance/finance.component').then(c => c.FinanceComponent)
  },
  {
    path: 'explore',
    title: 'Explore Dashboard',
    loadComponent: () => import('./explore/explore.component').then(c => c.ExploreComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
