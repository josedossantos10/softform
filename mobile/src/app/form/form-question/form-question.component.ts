import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from 'src/app/core/model/question';
import { FormGroup } from '@angular/forms';
import { DetailsComponent } from '../../details/details.component';

@Component({
  selector: 'app-form-question',
  templateUrl: './form-question.component.html',
  styleUrls: ['./form-question.component.scss'],
})
export class FormQuestionComponent implements OnInit {
  @Input() question: Question;

  @Input() form: FormGroup;

  @Input() history: number[];

  @Output() btnEmitter = new EventEmitter();

  private selectedTemp = [];

  private tempIndex: any;

  public maxDate = new Date().toISOString();

  inputValue = '';

  answer: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.loadStoredAnswers();
  }

  async accessDetailsFile(name: string) {
    const modal = await this.modalController.create({
      component: DetailsComponent,
      componentProps: {
        name: name.toUpperCase().replace('.PNG', ''),
        src: this.buildImagePathFromString(name),
      },
    });
    modal.present();
  }

  async accessDetails() {
    const modal = await this.modalController.create({
      component: DetailsComponent,
      componentProps: {
        src: this.buildImagePathFromString(
          `${this.question.id.toString()}.png`,
        ),
      },
    });
    modal.present();
  }

  checkStoredAnswer(answer) {
    if (
      this.question.answer[0] &&
      this.question.answer[0].answer.includes(answer)
    ) {
      if (this.question.questionType === 'select') {
        let value = `{"${this.question.answer[0].answer}"}`;
        value = JSON.parse(value.replace(/,/g, '","').replace(/::/g, '":"'));
        return value[answer];
      }
      if (this.question.questionType === 'dynamic-select') {
        let value = `{"${this.question.answer[0].answer}"}`;
        value = JSON.parse(value.replace(/;/g, '","').replace(/::/g, '":"'));

        return value[answer];
      }
      if (this.question.questionType === 'checkbox') {
        return true;
      }
      return false;
    }
  }

  loadStoredAnswers() {
    if (this.question && this.question.answer[0]) {
      if (this.question.questionType === 'checkbox') {
        this.onCheck(this.question.answer[0].answer);
      } else if (this.question.questionType === 'select') {
        const storedSelects = this.question.answer[0].answer.split(',');
        storedSelects.map(el => this.onMultiCheck(el));
      } else if (this.question.questionType === 'dynamic-select') {
        const storedSelects = this.question.answer[0].answer.split(';');
        storedSelects.map(el => this.onSelectCheck(el));
      } else {
        this.form.patchValue({
          [this.question.id]: this.question.answer[0].answer,
        });
        this.btnEmitter.emit({
          enableButton: true,
          type: this.question.questionType,
        });
      }
    }
  }

  onChange(answer) {
    if (answer.length > 0) {
      this.btnEmitter.emit({
        enableButton: true,
        type: this.question.questionType,
      });
    } else {
      this.btnEmitter.emit({
        enableButton: false,
        type: this.question.questionType,
      });
    }
  }

  onCheck(answer: string) {
    this.tempIndex = this.selectedTemp.findIndex(x => x === answer);
    if (this.tempIndex > -1) {
      this.selectedTemp.splice(this.tempIndex, 1);
    } else {
      this.selectedTemp.push(answer);
    }

    this.inputValue = this.selectedTemp.toString();

    if (this.selectedTemp.length > 0) {
      this.btnEmitter.emit({
        enableButton: true,
        type: this.question.questionType,
      });
    } else {
      this.btnEmitter.emit({
        enableButton: false,
        type: this.question.questionType,
      });
    }
  }

  onMultiCheck(answer: string) {
    this.tempIndex = this.selectedTemp.findIndex(
      x => x.split('::', 1)[0] === answer.split('::', 1)[0],
    );
    if (this.tempIndex > -1) {
      this.selectedTemp.splice(this.tempIndex, 1);
    }

    this.selectedTemp.push(answer);

    this.inputValue = this.selectedTemp.toString();

    if (this.selectedTemp.length >= this.question.alternatives.length) {
      this.btnEmitter.emit({
        enableButton: true,
        type: this.question.questionType,
      });
    }
  }

  onSelectCheck(answer: string) {
    this.tempIndex = this.selectedTemp.findIndex(
      x => x.split('::', 1)[0] === answer.split('::', 1)[0],
    );
    if (this.tempIndex > -1) {
      this.selectedTemp.splice(this.tempIndex, 1);
    }
    this.selectedTemp.push(answer);
    let buffer = '';
    this.selectedTemp.map(el => {
      buffer += `${el};`;
    });
    this.inputValue = buffer.slice(0, -1);
    if (this.selectedTemp.length >= this.question.alternatives.length) {
      this.btnEmitter.emit({
        enableButton: true,
        type: this.question.questionType,
      });
    }
  }

  /* The select options comes within the text of the alternative.
   * The method splits string into array of substrings according to a separator,
   * then removes first position and return the rest.
   */
  extractSelectOptions(alternative: string) {
    return alternative.split('||').slice(1);
  }

  extractFileNameFromString(text: string) {
    return text.split('||').slice(3)[0];
  }

  buildImagePathFromString(text: string) {
    return `../../assets/${text}`;
  }
}
