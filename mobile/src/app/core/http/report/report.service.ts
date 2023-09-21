import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserAdmin } from '../../model/userAdmin';

// TODO: handle http errors

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getMonitoringReport(admin: UserAdmin) {
    return this.http.post(`${this.baseUrl}/report/view_monitoring`, admin);
  }

  getMonitoringReportProcessed(admin: UserAdmin) {
    return this.http.post(
      `${this.baseUrl}/report-processed/view_monitoring`,
      admin,
    );
  }

  getMonitoringLiteReport(admin: UserAdmin) {
    return this.http.post(`${this.baseUrl}/report/view_monitoring_lite`, admin);
  }

  getRiskReport(admin: UserAdmin) {
    return this.http.post(`${this.baseUrl}/report/view_risk`, admin);
  }

  getRiskReportProcessed(admin: UserAdmin) {
    return this.http.post(`${this.baseUrl}/report-processed/view_risk`, admin);
  }

  getRiskLiteReport(admin: UserAdmin) {
    return this.http.post(`${this.baseUrl}/report/view_risk_lite`, admin);
  }

  getPendingReport(admin: UserAdmin) {
    return this.http.post(`${this.baseUrl}/report/view_pending`, admin);
  }

  getMindHealthyReport(admin: UserAdmin) {
    return this.http.post(
      `${this.baseUrl}/report-processed/view_mental_health`,
      admin,
    );
    // return this.http.post(this.baseUrl + '/report-mindHealthyReport/view_monitoring', admin);
  }
}
