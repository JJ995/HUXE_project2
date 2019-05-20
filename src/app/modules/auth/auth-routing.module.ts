import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { OnlyNotLoggedInGuard } from './guards/only-not-logged-in.guard';

const routes: Routes = [{
  path: 'login',
  canActivate: [OnlyNotLoggedInGuard],
  component: LoginComponent,
}, {
  path: 'logout',
  component: LogoutComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {

}
