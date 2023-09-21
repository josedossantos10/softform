import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { UserService } from '../core/http/user/user.service';
import { User } from '../core/model/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  private user: User;

  private btnLocked = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private storage: Storage,
  ) {
    this.storage.get('user').then((usr: User) => (this.user = usr));
  }

  ngOnInit() {
    this.btnLocked = false;
    this.registerForm = this.fb.group({
      occupation: ['', Validators.required],
      gender: ['', Validators.required],
      ethnicity: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0), Validators.max(200)]],
    });
    this.storage.get('user').then(usr => {
      if (usr) {
        this.registerForm.patchValue({
          occupation: this.user.occupation,
          gender: this.user.gender,
          ethnicity: this.user.ethnicity,
          age: this.user.age,
        });
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid && !this.btnLocked) {
      this.btnLocked = true;
      this.user = {
        ...this.user,
        ...this.registerForm.value,
      };

      this.userService.registerUser(this.user).subscribe(res => {
        this.storage.set('user', this.user).then(() => {
          this.router.navigate(['/networking']);
        });
      });
    }
  }
}
