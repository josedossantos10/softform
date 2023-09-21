import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { AuthService } from '../core/auth/user-auth.service';
import { ReportService } from '../core/http/report/report.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  private reportElement = document.createElement('a');

  private loading;

  constructor(
    private reportService: ReportService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private authService: AuthService,
    private router: Router,
  ) {}

  toCSV(json) {
    const fields = Object.keys(json[0]); // .sort((a, b) =>{ if(isNaN(parseFloat(a)) && a!='finishedAt') return b > a ? 1 : -1; });
    const replacer = (key, value) => {
      return value === null ? '' : value;
    };
    let csv = json.map(row => {
      return fields
        .map(fieldName => {
          return JSON.stringify(row[fieldName], replacer);
        })
        .join(';');
    });
    // add header column
    csv.unshift(fields.join(';'));
    csv = csv.join('\r\n');

    const hiddenElement = document.createElement('a');
    hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(csv)}`;
    hiddenElement.target = '_blank';
    return hiddenElement;
  }

  async presentToast(msg = 'Erro desconhecido') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      color: 'danger',
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Exportando dados...',
      duration: 3000,
    });
    return await this.loading.present();
  }

  async dismissLoading(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  weeklyReport() {
    this.presentLoading();
    const date = moment().format('DD-MM-YYYY-HH:mm');

    this.reportService
      .getMonitoringReport(this.authService.getAdminLoggedIn)
      .forEach((a: []) => {
        if (a && a.length) {
          this.reportElement = this.toCSV(a);
          this.reportElement.download = `monitoramento-${date}.csv`;
          this.reportElement.click();
        } else {
          this.presentToast('O relatório está vazio!');
        }
      });
    this.reportElement.remove();
    this.dismissLoading();
  }

  weeklyReportProcessed() {
    this.presentLoading();
    const date = moment().format('DD-MM-YYYY-HH:mm');

    this.reportService
      .getMonitoringReportProcessed(this.authService.getAdminLoggedIn)
      .forEach((a: []) => {
        if (a && a.length) {
          this.reportElement = this.toCSV(a);
          this.reportElement.download = `monitoramento-pro-${date}.csv`;
          this.reportElement.click();
        } else {
          this.presentToast('O relatório está vazio!');
        }
      });
    this.reportElement.remove();
    this.dismissLoading();
  }

  weeklyLiteReport() {
    this.presentLoading();
    const date = moment().format('DD-MM-YYYY-HH:mm');

    this.reportService
      .getMonitoringLiteReport(this.authService.getAdminLoggedIn)
      .forEach((a: []) => {
        if (a && a.length) {
          this.reportElement = this.toCSV(a);
          this.reportElement.download = `monitoramento-lite-${date}.csv`;
          this.reportElement.click();
        } else {
          this.presentToast('O relatório está vazio!');
        }
      });
    this.reportElement.remove();
    this.dismissLoading();
  }

  riskReport() {
    this.presentLoading();
    const date = moment().format('DD-MM-YYYY-HH:mm');

    this.reportService
      .getRiskReport(this.authService.getAdminLoggedIn)
      .forEach((a: []) => {
        if (a && a.length) {
          this.reportElement = this.toCSV(a);
          this.reportElement.download = `avaliacao-risco-${date}.csv`;
          this.reportElement.click();
        } else {
          this.presentToast('O relatório está vazio!');
        }
      });

    this.reportElement.remove();
    this.dismissLoading();
  }

  riskReportProcessed() {
    this.presentLoading();
    const date = moment().format('DD-MM-YYYY-HH:mm');

    this.reportService
      .getRiskReportProcessed(this.authService.getAdminLoggedIn)
      .forEach((a: []) => {
        if (a && a.length) {
          this.reportElement = this.toCSV(a);
          this.reportElement.download = `avaliacao-risco-pro-${date}.csv`;
          this.reportElement.click();
        } else {
          this.presentToast('O relatório está vazio!');
        }
      });

    this.reportElement.remove();
    this.dismissLoading();
  }

  mindHealthyReport() {
    this.presentLoading();
    const date = moment().format('DD-MM-YYYY-HH:mm');

    this.reportService
      .getMindHealthyReport(this.authService.getAdminLoggedIn)
      .forEach((a: []) => {
        if (a && a.length) {
          this.reportElement = this.toCSV(a);
          this.reportElement.download = `saude-mental-pro-${date}.csv`;
          this.reportElement.click();
        } else {
          this.presentToast('O relatório está vazio!');
        }
      });

    this.reportElement.remove();
    this.dismissLoading();
  }

  riskLiteReport() {
    this.presentLoading();
    const date = moment().format('DD-MM-YYYY-HH:mm');

    this.reportService
      .getRiskLiteReport(this.authService.getAdminLoggedIn)
      .forEach((a: []) => {
        if (a && a.length) {
          this.reportElement = this.toCSV(a);
          this.reportElement.download = `avaliacao-risco-lite-${date}.csv`;
          this.reportElement.click();
        } else {
          this.presentToast('O relatório está vazio!');
        }
      });

    this.reportElement.remove();
    this.dismissLoading();
  }

  pendingReport() {
    this.presentLoading();
    const date = moment().format('DD-MM-YYYY-HH:mm');

    this.reportService
      .getPendingReport(this.authService.getAdminLoggedIn)
      .forEach((a: []) => {
        if (a && a.length) {
          this.reportElement = this.toCSV(a);
          this.reportElement.download = `monitoramento-pendente-${date}.csv`;
          this.reportElement.click();
        } else {
          this.presentToast('O relatório está vazio!');
        }
      });

    this.reportElement.remove();
    this.dismissLoading();
  }

  get isLoading() {
    return this.isLoading;
  }

  goToAnalyticsPage(): void {
    const { centerId } = this.authService.getAdminLoggedIn;
    this.router.navigate(['/analytics'], { queryParams: { centerId } });
  }
}
