import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { RouterModule } from '@angular/router';

import { EndPageRoutingModule } from './end-routing.module';
import { EndPage } from './end.page';
import { AlertComponent } from '../alert/alert.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EndPageRoutingModule,
    RouterModule,
  ],
  declarations: [EndPage, AlertComponent],
  entryComponents: [AlertComponent],
  providers: [InAppBrowser, SocialSharing],
})
export class EndPageModule {}
