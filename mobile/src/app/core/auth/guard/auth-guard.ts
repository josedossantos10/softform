import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    return this.authService.isLoggedIn.then(usr => {
      if (!usr || !usr.active) {
        this.router.navigate(['/login'], {
          queryParams: {
            code: next.queryParams.code,
          },
        });
        return false;
      }
      return true;
    });
  }
}
