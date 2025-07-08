import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NewsListComponent } from './features/news/news-list/news-list.component';
import { NewsFormComponent } from './features/news/news-form/news-form.component';
import { NewsDetailComponent } from './features/news/news-detail/news-detail.component';
import { UsersComponent } from './features/users/users.component';
import { UserAddComponent } from './features/users/user-add.component';
import { UserEditComponent } from './features/users/user-edit.component';
import { StatisticsComponent } from './features/statistics/statistics.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/login.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: '<div class="container py-5 text-center"><h2>Unauthorized</h2><p>You do not have permission to access this page.</p></div>'
})
export class UnauthorizedPageStub {}

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedPageStub },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: 'news', component: NewsListComponent },
  { path: 'news/create', component: NewsFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin', 'editor'] } },
  { path: 'news/:id/edit', component: NewsFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin', 'editor'] } },
  { path: 'news/:id', component: NewsDetailComponent },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'editor'] },
    children: [
      { path: 'add', component: UserAddComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
      { path: ':id/edit', component: UserEditComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin', 'editor'] } }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LoginComponent,
    UnauthorizedPageStub
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
