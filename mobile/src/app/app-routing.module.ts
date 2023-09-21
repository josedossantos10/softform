import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { NavigationGuard } from './core/auth/guard/navigation-guard';
import { AuthGuard } from './core/auth/guard/auth-guard';
import { AdminGuard } from './core/auth/guard/admin-guard';

const routes: Routes = [
  // User Pages
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then(m => m.RegisterPageModule),
    canActivate: [AuthGuard, NavigationGuard],
  },
  {
    path: 'form',
    loadChildren: () =>
      import('./form/form.module').then(m => m.FormPageModule),
    canActivate: [AuthGuard, NavigationGuard],
  },
  {
    path: 'end',
    loadChildren: () => import('./end/end.module').then(m => m.EndPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'end/:type',
    loadChildren: () => import('./end/end.module').then(m => m.EndPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'landing/:type',
    loadChildren: () =>
      import('./landing/landing.module').then(m => m.LandingPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'offline',
    loadChildren: () =>
      import('./offline/offline.module').then(m => m.OfflinePageModule),
  },
  {
    path: 'terms',
    loadChildren: () =>
      import('./terms/terms.module').then(m => m.TermsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'networking',
    loadChildren: () =>
      import('./networking/networking.module').then(
        m => m.NetworkingPageModule,
      ),
    canActivate: [AuthGuard],
  },

  // Admin pages
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminPageModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'analytics',
    loadChildren: () =>
      import('./analytics/analytics.module').then(m => m.AnalyticsPageModule),
    canActivate: [AdminGuard],
  },
  {
    path: 'manager',
    loadChildren: () =>
      import('./manager/manager.module').then(m => m.ManagerPageModule),
    canActivate: [AdminGuard],
  },

  { path: '**', redirectTo: 'register' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
