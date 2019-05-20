import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class OnlyNotLoggedInGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkOrRedirect();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkOrRedirect();
  }

  /**
   * checks if the user is logged in.
   * If logged in it redirects the user to the /app/dashboard route
   */
  checkOrRedirect() {
    return this.authService.isLoggedIn()
      .pipe(map(isLoggedIn => {
        if (isLoggedIn) {
          return this.router.createUrlTree(['/app/dashboard']);
        } else {
          return true;
        }
      }));
  }
}
