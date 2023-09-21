import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
})
export class OfflinePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.reconect();
  }

  reconect() {
    if (window.navigator.onLine) {
      window.open('your_url', '_self');
    }
  }
}
