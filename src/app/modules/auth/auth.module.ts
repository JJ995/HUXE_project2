import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { OnlyNotLoggedInGuard } from './guards/only-not-logged-in.guard';

export function initializeAuthState(authService: AuthService) {
  return () => authService.initializeAuthState();
}

@NgModule({
  declarations: [LoginComponent, LogoutComponent],
  providers: [
    AuthGuard,
    OnlyNotLoggedInGuard,
    { provide: APP_INITIALIZER, useFactory: initializeAuthState, deps: [AuthService], multi: true },
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
  ]
})
export class AuthModule { }
