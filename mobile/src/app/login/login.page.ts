import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { AuthService } from 'src/app/core/auth/user-auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userForm: FormGroup;

  constructor(
    private router: Router,
    private storage: Storage,
    private fb: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.storage.get('user').then(usr => {
      if (usr) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const { code } = params;

      this.userForm = this.fb.group({
        id: [code || '', Validators.required],
      });
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.authService.login(this.userForm.value);
    }
  }
}
