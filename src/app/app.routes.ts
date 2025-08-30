import { Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile.component';

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
  },
  { path: 'profile', component: UserProfileComponent },
  {
    path: 'dynamic-form',
    loadComponent: () =>
      import('./components/dynamic-form.component').then(m => m.DynamicFormComponent)
  },
  {
    path: 'product-details',
    loadComponent: () =>
      import('./components/product-details/product-details.component').then(m => m.ProductDetailsComponent)
  }
];
