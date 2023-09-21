import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ToastController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { User } from '../core/model/user';
import { UserService } from '../core/http/user/user.service';
import { AlertComponent } from '../alert/alert.component';
import { CenterService } from '../core/http/center/center.service';
import { Center } from '../core/model/center';
import isValidHttpUrl from '../../utils/isValidUrl';

@Component({
  selector: 'app-end',
  templateUrl: './end.page.html',
  styleUrls: ['./end.page.scss'],
})
export class EndPage implements OnInit {
  private onDate: any;

  private daysToMonitoring = 15;

  private loading;

  private linkUserCode;

  private shareMessage =
    'Olá, estou te enviando um convite para para participar de uma pesquisa! ';

  showFinishButton = false;

  constructor(
    private storage: Storage,
    private userService: UserService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private centerService: CenterService,
    private inAppBrowser: InAppBrowser,
    private socialSharing: SocialSharing,
  ) {}

  async ngOnInit(): Promise<void> {
    moment.locale('pt');
    this.loadData();

    await this.setUserLinkCode();

    this.route.params.subscribe(async params => {
      if (['01', '02'].includes(params.type)) {
        this.accessDetailsFile('alerta.png');
      }
    });

    this.storage.get('user').then(usr => {
      this.userService.sendUserIdToOuterSystem(usr.id).subscribe(
        res => {
          console.log(res);
          // this.userService.logOuterSystemResponse(
          //   usr.id,
          //   usr.finishedAt,
          //   res,
          // );
        },
        err => console.error(err),
      );
    });
  }

  async accessDetailsFile(name: string) {
    const modal = await this.modalController.create({
      component: AlertComponent,
      componentProps: {
        src: this.buildImagePathFromString(name),
      },
    });
    modal.present();
  }

  async loadData() {
    await this.storage.get('user').then(usr => {
      this.userService
        .logInUser(usr)
        .toPromise()
        .then((user: User) => {
          if (!user || !user.active) {
            this.storage.remove('user');
          }
        });
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      duration: 5000,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      return await this.loading.dismiss();
    }
  }

  buildImagePathFromString(text: string) {
    return `../assets/${text}`;
  }

  async setUserLinkCode() {
    const user = await this.storage.get('user');
    const userCenterCode = user.id[0];

    const { url } = await this.centerService
      .getUrlFromCenter(userCenterCode)
      .toPromise<Center>();

    if (!isValidHttpUrl(url)) {
      throw new Error('Invalid center url');
    }

    const urlWithParam = url + user.id;

    this.linkUserCode = urlWithParam;
  }

  async copyUserLink() {
    let response = null;
    //    this.clipboard.copy(this.getLink());
    if (this.getLink) {
      navigator.clipboard.writeText(this.getLink);
      response = await navigator.clipboard.readText();
      if (response) {
        this.presentToast('Texto copiado!', 'primary');
      }
    }
    if (!this.getLink || !response) {
      this.presentToast('Não foi possível copiar!');
    }
  }

  async shareUserLink() {
    if (this.getLink) {
      window.open(
        `https://api.whatsapp.com/send?text=${this.shareMessage}${this.getLink}`,
        '_blank',
      );
    } else {
      this.presentToast('Não foi possível compartilhar!');
    }
  }

  async presentToast(
    msg = 'Erro desconhecido',
    type = 'danger',
  ): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      color: type,
    });
    toast.present();
  }

  get getLink() {
    return this.linkUserCode;
  }

  async redirectUserToCorrespondingCenter(): Promise<void> {
    const user = await this.storage.get('user');
    const userCenterCode = user.id[0];

    const { url } = await this.centerService
      .getUrlFromCenter(userCenterCode)
      .toPromise<Center>();

    if (!isValidHttpUrl(url)) {
      throw new Error('Invalid center url');
    }

    this.showFinishButton = true;

    const urlWithParam = url + user.id;

    this.inAppBrowser.create(urlWithParam, '_self');
  }
}
