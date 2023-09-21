import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NetworkingPage } from './networking.page';

const routes: Routes = [
  {
    path: '',
    component: NetworkingPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkingPageRoutingModule {}
