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
  },
  {
    path: 'orders',
    loadComponent: () => import('./components/order-processor.component').then(m => m.OrderProcessorComponent)
  },
  {
    path: 'leave',
    loadComponent: () => import('./components/leave-approval.component').then(m => m.LeaveApprovalComponent)
  }
];
