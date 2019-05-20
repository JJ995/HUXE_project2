import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoggedInComponent } from '../general/components/logged-in/logged-in.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [{
  path: 'app',
  canActivate: [AuthGuard],
  canActivateChild: [AuthGuard],
  component: LoggedInComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
