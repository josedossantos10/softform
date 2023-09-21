import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth/user-auth.service';
import { UserService } from '../core/http/user/user.service';
import { User } from '../core/model/user';
import { UserAdmin } from '../core/model/userAdmin';
import * as moment from 'moment';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})
export class ManagerPage implements OnInit {
  private loading;

  public mensagem = 'Nenhum usuário para exibir';

  public entradaID: string;

  public user: User;
  public moment;

  admin: UserAdmin;

  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
  ) {
    this.entradaID = '';
    moment.locale('pt');

  }

  ngOnInit(): void {
    this.admin = this.authService.getAdminLoggedIn;
  }

  canSearch() {
    if (this.entradaID.length === 9) {
      this.search();
    }
  }

  search() {
    this.user = null;
    if (this.authService.getAdminLoggedIn) {
      this.presentLoading('Acessando...');
      this.userService
        .getUser(this.entradaID, this.authService.getAdminLoggedIn)
        .toPromise()
        .then(user => {
          if (user) {
            this.user = user;
            this.entradaID = '';
          } else {
            this.mensagem = `Usuário "${this.entradaID.toUpperCase()}" não encontrado`;
          }
        })
        .catch(err => {
          console.log(err.error);

          this.mensagem = `Falha ao localizar o usuário ${this.entradaID}`;
          this.presentToast(err.error.error);
        })
        .finally(() => this.dismissLoading());
    } else {
      this.presentToast('Não Autorizado');
    }
  }

  save() {
    if (this.authService.getAdminLoggedIn) {
      this.presentLoading('Salvando...');
      this.userService
        .setUser(this.user, this.authService.getAdminLoggedIn, 'ALTERAÇÃO')
        .toPromise()
        .then(e => {
          this.user = undefined;
          this.presentToast('Alterações salvas', 'primary');
        })
        .finally(() => {
          this.dismissLoading();
        })
        .catch(err => {
          this.presentToast(`Falha ao salvar!\n${err.error.error}`);
        });
    }
  }

  getData(data){
    if(data){
      return moment(data).calendar();
    }
    return 'Sem informação'
  }

  async presentLoading(msg) {
    this.loading = await this.loadingController.create({
      message: msg,
      duration: 10000,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      return await this.loading.dismiss();
    }
  }

  async presentToast(msg = 'Erro desconhecido', color = 'danger') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      color,
    });
    toast.present();
  }
}
