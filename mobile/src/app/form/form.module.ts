import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DetailsComponent } from '../details/details.component';

import { FormPageRoutingModule } from './form-routing.module';

import { FormPage } from './form.page';
import { FormQuestionComponent } from './form-question/form-question.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormPageRoutingModule,
  ],
  declarations: [FormPage, FormQuestionComponent, DetailsComponent],
  entryComponents: [DetailsComponent],
})
export class FormPageModule {}
