import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AnalyticsMetrics } from '../../model/analyticsMetrics';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  generateMetrics(centersIds: number[]): Observable<AnalyticsMetrics> {
    return this.http.post<AnalyticsMetrics>(`${this.baseUrl}/analytics`, {
      centersIds,
    });
  }
}
