import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  ToastController,
  LoadingController,
} from '@ionic/angular';

import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserService } from '../core/http/user/user.service';
import { User } from '../core/model/user';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {
  private acceptButton;

  private user: User;

  private loading;

  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    private router: Router,
    private userService: UserService,
    private storage: Storage,
    public modalController: ModalController,
  ) {}

  ngOnInit() {
    if (window.navigator.onLine) {
      this.storage.get('user').then(usr => {
        this.user = usr;
        this.acceptButton = document.getElementById('accept-button');
      });
    } else {
      this.router.navigate(['/offline']);
    }
  }

  onSubmit() {
    this.presentLoading();
    this.userService.setAcceptedTerms(this.user).subscribe(
      usr => {
        this.user = usr;
        this.storage.set('user', this.user).then(() => {
          this.dismissLoading().then(() => {
            if (this.user.occupation) {
              this.router.navigate(['/form']);
            } else {
              this.router.navigate(['/register']);
            }
          });
        });
      },
      err => console.error(err),
    );
  }

  openPDF() {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'assets/TCLE-pesquisa.pdf';
    link.download = 'TCLE pesquisa.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      duration: 3000,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      return await this.loading.dismiss();
    }
  }
}
