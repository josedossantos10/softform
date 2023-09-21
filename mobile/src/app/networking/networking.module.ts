import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NetworkingPageRoutingModule } from './networking-routing.module';

import { NetworkingPage } from './networking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NetworkingPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [NetworkingPage],
})
export class NetworkingPageModule {}
