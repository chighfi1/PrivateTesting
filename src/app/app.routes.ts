import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/address',
    pathMatch: 'full'
  },
  {
    path: 'address',
    loadComponent: () => import('./components/user-address.component').then(m => m.UserAddressComponent)
  }
];
