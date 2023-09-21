import { ToastController } from '@ionic/angular';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Question } from 'src/app/core/model/question';
import { QuestionService } from '../core/http/question/question.service';
import { AnswerService } from '../core/http/answer/answer.service';
import { Answer } from '../core/model/answer';
import { User } from '../core/model/user';
import { UserService } from '../core/http/user/user.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit, AfterViewInit {
  @ViewChild('formSlider', { static: false }) formSlider: any;

  @ViewChild('content', { static: false }) private content: any;

  formQuestions: Question[];

  form: FormGroup;

  private user: User;

  private buttonLabel = 'Próxima';

  private isEnd = false;

  private loading = false;

  private isBeginning = true;

  private isAnswered = false;

  private lastQuestionAnsweredOrder = 0;

  private alreadyScrollDown = false;

  private nextButton;

  lastAnswer: any;

  navigationHistory = [];

  history = [];

  sliderConfig = {
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    },
    autoHeight: true,
    spaceBetween: 10,
    centeredSlides: true,
  };

  constructor(
    private questionService: QuestionService,
    private answerService: AnswerService,
    private userService: UserService,
    private storage: Storage,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit() {
    if (window.navigator.onLine) {
      this.storage.get('user').then(usr => {
        this.user = usr;
        this.questionService.getQuestions(usr.id).subscribe(data => {
          this.formQuestions = data.sort((a, b) =>
            a.order > b.order ? 1 : -1,
          );

          this.form = this.toFormGroup(this.formQuestions);

          this.formSlider.lockSwipes(false);
          if (this.navigationHistory.length > 0) {
            this.formSlider.slideTo(
              this.navigationHistory[this.navigationHistory.length - 1] - 1,
            );
          }
          this.navigationHistory.pop();
          this.formSlider.lockSwipes(true);
        });
      });
      this.nextButton = document.getElementById('next-button');
    } else {
      this.router.navigate(['/offline']);
    }
  }

  ngAfterViewInit() {
    this.formSlider.lockSwipes(true);
  }

  scoreCheckBox(questionId) {
    let pontos = 0;
    const allAlternatives = this.formQuestions.filter(
      a => a.id === questionId,
    )[0].alternatives;
    const trueAlternatives = this.form.value[questionId];

    allAlternatives.forEach(el => {
      if (trueAlternatives && trueAlternatives.includes(el.text)) {
        pontos++;
      }
    });

    return pontos;
  }

  scoreDynamicSelect(questionId) {
    let pontos = 0;
    this.form.value[questionId].split('::').forEach((el: string) => {
      if (
        el &&
        el !== '' &&
        !el.toLocaleLowerCase().includes('não se aplica')
      ) {
        pontos += Number(el.substring(0, el.indexOf('-')));
      }
    });

    return pontos;
  }

  scoreDynamicSelectYes(questionId) {
    let pontos = 0;
    this.form.value[questionId].split('::').forEach((el: string) => {
      if (el && el !== '' && el.toLocaleLowerCase().includes('sim')) {
        pontos++;
      }
    });

    return pontos;
  }

  scoreDynamicSelectNot(questionId) {
    return (
      this.form.value[questionId].split('::').length -
      this.scoreDynamicSelect(questionId)
    );
  }

  async slideNext() {
    const isPageBottom = await this.goScrollToBottom();

    this.nextButton.disabled = true;
    const currentSlideIndex = await this.formSlider.getActiveIndex();
    const { id, monitoring } = await this.getCurrentQuestion();

    if (
      !this.history.includes(id) &&
      isPageBottom &&
      this.getIsAnswered &&
      !this.loading &&
      (await this.saveCurrentAnswer())
    ) {
      this.alreadyScrollDown = false;
      this.slideFlow(this.formQuestions[currentSlideIndex]);

      if (this.isEnd) {
        this.user.finishedAt = new Date();
        this.userService.setFinished(this.user).subscribe(
          res => {
            this.storage.set('user', this.user);
          },
          err => console.error(err),
        );

        //        SQR=36                  AUDIT=37
        if (
          this.scoreDynamicSelectYes(36) >= 8 ||
          (this.scoreDynamicSelect(37) >= 6 && this.formQuestions[0].monitoring)
        ) {
          this.router.navigate(['/end', '01']);
        } else if (
          this.scoreDynamicSelectYes(36) >= 8 ||
          this.scoreDynamicSelect(37) >= 6
        ) {
          this.router.navigate(['/end', '02']);
        } else if (this.formQuestions[0].monitoring) {
          this.router.navigate(['/end', '03']);
        } else {
          this.router.navigate(['/end', '04']);
        }
      }

      this.hasAnswered();
      //   this.nextButton.disabled=false;
    } else if (!isPageBottom) {
    } else if (this.history.includes(id)) {
      this.alreadyScrollDown = false;
      this.slideFlow(this.formQuestions[currentSlideIndex]);
      this.hasAnswered();
    } else if (!this.getIsAnswered) {
      //  this.nextButton.disabled=false;
      this.presentToast(
        'É necessário responder essa pergunta para prosseguir!',
      );
    } else if (!window.navigator.onLine) {
      this.router.navigate(['/offline']);
    } else if (!this.loading) {
      console.error('Ocorreu uma falha desconhecida');
      //    this.nextButton.disabled = false;
      this.buttonLabel = 'Tente novamente';
    }
    this.nextButton.disabled = false;
  }

  async slideBack() {
    this.formSlider.lockSwipes(false);
    // Verifica se o usuário está no monitoramento, precisa remover 16 posições para representar o slide corretamente
    if (this.navigationHistory.length > 0 && this.formQuestions[0].monitoring) {
      this.formSlider.slideTo(
        this.navigationHistory[this.navigationHistory.length - 1] - 16,
      );
      this.navigationHistory.pop();
    } else if (this.navigationHistory.length > 0) {
      this.formSlider.slideTo(
        this.navigationHistory[this.navigationHistory.length - 1] - 1,
      );
      this.navigationHistory.pop();
    }
    this.hasAnswered();
    this.formSlider.lockSwipes(true);
  }

  async goScrollToBottom() {
    return this.content
      .getScrollElement()
      .then((el: HTMLElement) => {
        if (
          el.scrollHeight - 30 <= el.scrollTop + el.offsetHeight ||
          this.alreadyScrollDown
        ) {
          return true;
        }
        this.content.scrollToPoint(
          el.scrollLeft,
          el.scrollTop + el.offsetHeight,
          500,
        );
        return false;
      })
      .catch(err => {
        return false;
      });
  }

  checkScrollBottom() {
    this.content
      .getScrollElement()
      .then((el: HTMLElement) => {
        if (el.scrollHeight - 30 <= el.scrollTop + el.offsetHeight) {
          this.alreadyScrollDown = true;
        }
      })
      .catch(err => {
        return false;
      });
  }

  slideFlow(question: Question) {
    const { jumpToQuestionId, jumpAlternative, id, order } = question;

    this.lastAnswer = this.form.value[id];

    this.navigationHistory.push(order);
    this.history.push(order);

    this.formSlider.lockSwipes(false);

    const shouldJumpQuestion =
      jumpToQuestionId &&
      (this.lastAnswer === jumpAlternative ||
        jumpAlternative === 'always' ||
        (jumpAlternative === 'score' &&
          this.scoreDynamicSelectYes(id - 1) < 8 &&
          this.scoreDynamicSelect(id) < 6));

    if (shouldJumpQuestion) {
      const slideIndex = this.findQuestionOrderById(jumpToQuestionId);
      this.formSlider.slideTo(slideIndex);
    } else {
      this.formSlider.slideNext();
    }

    this.formSlider.lockSwipes(true);
  }

  findQuestionOrderById(questionId) {
    const order = this.formQuestions.findIndex(question => {
      return question.id === questionId;
    });

    return order;
  }

  toFormGroup(questions: Question[]) {
    const form: any = [];

    questions.map(q => {
      this.lastQuestionAnsweredOrder++;
      if (q.answer[0]) {
        this.navigationHistory.push(this.lastQuestionAnsweredOrder);
        this.history.push(this.lastQuestionAnsweredOrder);
      }
      if (q.questionType === 'numberpicker') {
        form[q.id] = new FormControl('', [
          Validators.required,
          Validators.min(0),
          Validators.max(200),
        ]);
      } else {
        form[q.id] = new FormControl('', Validators.required);
      }
    });
    return new FormGroup(form);
  }

  handleSlideChange() {
    this.checkBeginning();
    this.checkEnd();
  }

  checkBeginning() {
    this.formSlider.isBeginning().then((beginning: boolean) => {
      this.isBeginning = beginning;
    });
  }

  checkEnd() {
    this.formSlider.getActiveIndex().then(index => {
      // The questions order starts with 1 and the slider index starts with 0
      if (index === this.lastQuestionAnsweredOrder - 1) {
        this.isEnd = true;
        this.buttonLabel = 'Finalizar';
      } else {
        this.isEnd = false;
        this.buttonLabel = 'Próxima';
      }
    });
  }

  async saveCurrentAnswer() {
    const { id, monitoring } = await this.getCurrentQuestion();
    this.loading = true;

    const answer: Answer = {
      userId: this.user.id,
      questionId: id,
      answer: this.form.value[id],
      monitoring,
      answeredAt: new Date(),
    };

    return (await this.answerService.saveAnswer(answer))
      .toPromise()
      .then(e => {
        this.loading = false;
        return true;
      })
      .catch(e => {
        this.loading = false;
        return false;
      });
  }

  getCurrentQuestion() {
    return this.formSlider.getActiveIndex().then((idx: number) => {
      return this.formQuestions[idx];
    });
  }

  async hasAnswered() {
    const { id } = await this.getCurrentQuestion();
    const questionStatus = this.form.controls[id].status;

    if (questionStatus && questionStatus === 'VALID') {
      this.isAnswered = true;
    } else {
      this.isAnswered = false;
    }
  }

  async presentToast(msg = 'Erro desconhecido') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      color: 'danger',
    });

    toast.present();
  }

  get getIsBeginning() {
    return this.isBeginning;
  }

  get getIsAnswered() {
    return this.isAnswered;
  }

  get getButtonLabel() {
    return this.buttonLabel;
  }

  get getLoading() {
    return this.loading;
  }
}
