import { Component, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { Storage } from '@ionic/storage';

import { User } from './core/model/user';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private swUpdate: SwUpdate,
    public toastController: ToastController,
    private storage: Storage,
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.checkForUpdate();
    this.newUpdateAvailable();
    await this.alterUserId();
  }

  async alterUserId() {
    const user: User = await this.storage.get('user');
    if (user && user.id.length === 8) {
      user.id = `4${user.id}`;
      await this.storage.set('user', user);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  // Check for code updates every 12 hours
  checkForUpdate() {
    if (this.swUpdate.isEnabled) {
      interval(12 * 60 * 60 * 1000).subscribe(() =>
        this.swUpdate
          .checkForUpdate()
          .then(() => console.log('checking for updates')),
      );
    }
  }

  newUpdateAvailable(): void {
    this.swUpdate.available.subscribe(event => this.promptUserAndReload());
  }

  promptUserAndReload() {
    console.log('new version available');
    this.presentToast().then(() => {
      console.log('updating...');
      setTimeout(() => {
        document.location.reload();
      }, 3000);
    });
  }

  async presentToast(msg = 'Nova versão disponível, atualizando...') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'primary',
    });
    toast.present();
  }
}
