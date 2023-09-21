import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { CenterService } from '../core/http/center/center.service';
import { AnalyticsService } from '../core/http/analytics/analytics.service';
import { Center } from '../core/model/center';
import { AnalyticsMetrics } from '../core/model/analyticsMetrics';

interface CentersCheckboxProps extends Center {
  isChecked: boolean;
}

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {
  private centers: Center[];

  centersCheckbox: CentersCheckboxProps[];

  metrics: AnalyticsMetrics;

  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private centerService: CenterService,
    private analyticsService: AnalyticsService,
    private toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.initializePageData();
  }

  initializePageData(): void {
    this.route.queryParams.subscribe(params => {
      const { centerId } = params;

      this.centerService.getCenters().subscribe(
        centers => {
          this.centers = centers;

          const centerIdNumber = Number(centerId);

          this.filterCentersByAdminCenter(centerIdNumber);

          this.createCentersCheckbox(centerIdNumber);

          this.getCentersAnalytics();
        },
        err => {
          this.presentToast();
        },
      );
    });
  }

  filterCentersByAdminCenter(adminCenterId: number): void {
    if (adminCenterId === 4) {
      const centerIndex = this.centers.findIndex(
        center => Number(center.id) === 4,
      );

      this.centers = this.centers.splice(centerIndex, 1);
    } else {
      this.centers = this.centers.filter(center => Number(center.id) !== 4);
    }
  }

  createCentersCheckbox(adminCenterId: number): void {
    this.centersCheckbox = this.centers.map(center => ({
      ...center,
      isChecked: false,
    }));

    const adminCenter = this.centersCheckbox.find(
      center => Number(center.id) === adminCenterId,
    );

    if (adminCenter) {
      adminCenter.isChecked = true;
    }
  }

  getCentersAnalytics(): void {
    this.toggleLoading();

    const checkedCentersIds = this.centersCheckbox
      .filter(center => center.isChecked)
      .map(center => Number(center.id));

    this.analyticsService
      .generateMetrics(checkedCentersIds)
      .subscribe(
        metrics => {
          this.metrics = metrics;
        },
        err => {
          this.presentToast();
        },
      )
      .add(() => this.toggleLoading());
  }

  hasAnyCenterCheckboxChecked(): boolean {
    const reducer = (
      accumulator: boolean,
      currentCenter: CentersCheckboxProps,
    ) => accumulator || currentCenter.isChecked;

    return this.centersCheckbox && this.centersCheckbox.reduce(reducer, false);
  }

  toggleLoading(): void {
    this.loading = !this.loading;
  }

  async presentToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Erro ao buscar informações, tente novamente',
      duration: 3500,
      color: 'danger',
    });

    toast.present();
  }
}
