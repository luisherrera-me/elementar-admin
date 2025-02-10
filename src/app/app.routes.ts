import { Routes } from '@angular/router';
import { authLoginGuard } from './core/guards/auth-login.guard';
import { authGuard } from './core/guards/auth.guard';
export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [authLoginGuard]
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [authGuard]
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorModule),
    canActivate: [authGuard]
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () => import('./error/not-found/not-found.component').then(c => c.NotFoundComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'pages/dashboard/basic',
    pathMatch: 'full',
  },
];
