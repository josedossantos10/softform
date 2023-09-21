import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController, LoadingController } from '@ionic/angular';

import { Md5 } from 'ts-md5/dist/md5';
import { User } from '../model/user';
import { UserService } from '../http/user/user.service';
import { AdminService } from '../http/admin/admin.service';
import { UserAdmin } from '../model/userAdmin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loading;

  private admin: UserAdmin;

  get isLoggedIn(): Promise<any> {
    return this.storage.get('user');
  }

  get getAdminLoggedIn(): UserAdmin {
    return this.admin;
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private adminService: AdminService,
    private storage: Storage,
    public toastController: ToastController,
    public loadingController: LoadingController,
  ) {}

  login(user: User): void {
    if (user && user.id.length === 8) {
      user.id = `4${user.id}`;
    }

    user.id = user.id.trim();

    this.presentLoading();

    this.userService.logInUser(user).subscribe(
      async (usr: User) => {
        const updatedUser = { ...usr };

        if (usr.id[0] !== '4') {
          const { termsAcceptedAt } = await this.userService
            .setAcceptedTerms(usr)
            .toPromise<User>();

          updatedUser.termsAcceptedAt = termsAcceptedAt;
        }

        if (updatedUser && updatedUser.active) {
          this.router.navigate(['/']);
          this.storage.set('user', updatedUser).then(() => {
            this.dismissLoading().then(() => {
              if (updatedUser.occupation && updatedUser.termsAcceptedAt) {
                this.router.navigate(['/']);
              } else if (updatedUser.termsAcceptedAt) {
                this.router.navigate(['/register']);
              } else {
                this.router.navigate(['/terms']);
              }
            });
          });
        } else {
          this.presentToast('Entre em contato com o administrador do sistema.');
        }
      },
      err => {
        this.dismissLoading();
        this.presentToast(err.error.error);
      },
    );
  }

  loginAdmin(admin: UserAdmin): void {
    this.presentLoading();

    admin.password = String(Md5.hashStr(admin.password));
    this.adminService.logInAdmin(admin).subscribe(
      (user: UserAdmin) => {
        this.dismissLoading().then(() => {
          if (user.password === admin.password) {
            if (user.active) {
              this.admin = user;
              this.router.navigate(['/dashboard']);
            } else {
              this.presentToast('Usuário inativo');
            }
          } else {
            this.presentToast('Usuário ou senha incorreta');
          }
        });
      },
      err => {
        this.dismissLoading().then(() => {
          this.presentToast(err.error.error);
        });
      },
    );
  }

  async presentToast(msg = 'Erro desconhecido'): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      color: 'danger',
    });
    toast.present();
  }

  async presentLoading(): Promise<void> {
    this.loading = await this.loadingController.create({
      message: 'Acessando...',
      duration: 3000,
    });
    await this.loading.present();
  }

  async dismissLoading(): Promise<any> {
    if (this.loading) {
      return await this.loading.dismiss();
    }
  }

  logout(): void {
    this.storage.remove('user');
    this.router.navigate(['/login']);
  }
}
