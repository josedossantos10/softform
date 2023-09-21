import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  private type: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const valid = ['unfinished', 'monitoring'];
    this.route.params.subscribe(params => {
      if (params.type && valid.includes(params.type)) {
        this.type = params.type;
      } else {
        this.router.navigate(['/register']);
      }
    });
  }

  onClick() {
    this.router.navigate(['/form']);
    /*
    if('unfinished'===this.type){
      this.router.navigate(['/register'])
    } else if('monitoring'===this.type){
        this.router.navigate(['/form'])
    }
    */
  }

  get getType() {
    return this.type;
  }
}
