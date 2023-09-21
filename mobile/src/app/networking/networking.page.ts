import { ToastController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserService } from '../core/http/user/user.service';
import { User } from '../core/model/user';

@Component({
  selector: 'app-networking',
  templateUrl: './networking.page.html',
  styleUrls: ['./networking.page.scss'],
})
export class NetworkingPage implements OnInit {
  @ViewChild('content', { static: false }) private content: any;

  networkingForm: FormGroup;

  private user: User;

  private btnLocked = false;

  private alreadyScrollDown = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    public toastController: ToastController,
    private storage: Storage,
  ) {
    this.storage.get('user').then((usr: User) => {
      this.user = usr;
      if (usr.d) {
        this.networkingForm.patchValue({
          a: usr.a,
          b: usr.b,
          c: usr.c,
          d: usr.d,
        });
      }
    });
  }

  ngOnInit() {
    this.btnLocked = false;
    this.networkingForm = this.fb.group({
      a: ['', Validators.required],
      b: ['', Validators.required],
      c: ['', Validators.required],
      d: ['', Validators.required],
    });
  }

  updateValidators() {
    this.networkingForm.controls.b.setValidators([
      Validators.required,
      Validators.max(this.networkingForm.value.a),
    ]);
    this.networkingForm.controls.c.setValidators([
      Validators.required,
      Validators.max(this.networkingForm.value.b),
    ]);
    /*
     this.networkingForm.controls.d.setValidators(
       [Validators.required,Validators.max(this.networkingForm.value['c'])]
     );   
 */
    this.b.updateValueAndValidity();
    this.c.updateValueAndValidity();
    //  this.d.updateValueAndValidity();
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

  async onSubmit() {
    const isBottonPage = await this.goScrollToBottom();
    if (isBottonPage && this.networkingForm.valid && !this.btnLocked) {
      this.alreadyScrollDown = false;
      this.btnLocked = true;
      this.user = {
        ...this.user,
        ...this.networkingForm.value,
      };
      this.userService.registerNetworking(this.user).subscribe(
        res => {
          this.btnLocked = false;
          this.storage.set('user', this.user).then(() => {
            this.router.navigate(['/form']);
          });
        },
        err => {
          this.btnLocked = false;
          console.error(err);
        },
      );
    } else if (isBottonPage && this.networkingForm.invalid) {
      this.presentToast('Preencha todos os campos corretamente');
    }
  }

  async presentToast(msg = 'Erro desconhecido') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'danger',
    });
    toast.present();
  }

  get occupation() {
    if (this.user && this.user.occupation) {
      return `${this.user.occupation.toLocaleUpperCase()}S`;
    }
    return 'da sua profissão';
  }

  get a() {
    return this.networkingForm.get('a');
  }

  get b() {
    return this.networkingForm.get('b');
  }

  get c() {
    return this.networkingForm.get('c');
  }

  get d() {
    return this.networkingForm.get('d');
  }
}
