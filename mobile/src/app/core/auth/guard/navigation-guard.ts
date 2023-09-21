import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class NavigationGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    return this.storage.get('user').then(usr => {
      const diff = Math.abs(moment().diff(moment(usr.finishedAt), 'days'));

      const { url } = this.router;

      if (!usr || !usr.active) {
        this.storage.remove('user').then(() => {
          this.router.navigate(['/login']);
          return false;
        });
      } else if (!usr.termsAcceptedAt) {
        this.router.navigate(['/terms']);
        return false;
      } else if (!usr.d && usr.occupation) {
        this.router.navigate(['/networking']);
        return false;
      }

      if (url === '/' || url === '/login') {
        if (!usr.finishedAt && usr.occupation) {
          // User hadn't finished answering
          this.router.navigate(['/landing', 'unfinished']);
          return false;
        }
        if (diff >= 14) {
          // New monitoring questions available
          this.router.navigate(['/landing', 'monitoring']);
          return false;
        }
      }

      if (usr.finishedAt && diff < 14) {
        // User finished and is waiting for new week
        this.router.navigate(['/end']);
        return false;
      }
      if (url !== '/login' && !usr.occupation && !usr.termsAcceptedAt) {
        // User not registered and didn't come from login
        this.router.navigate(['/login']);
        return false;
      }
      if (url === '/login' && usr.occupation) {
        this.router.navigate(['/landing', 'unfinished']);
        return false;
      }

      return true;
    });
  }
}
