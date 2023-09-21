import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Center } from '../../model/center';

@Injectable({
  providedIn: 'root',
})
export class CenterService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCenters(): Observable<Center[]> {
    return this.http.get<Center[]>(`${this.baseUrl}/centers`);
  }

  getUrlFromCenter(code: string): Observable<Center> {
    return this.http.get<Center>(`${this.baseUrl}/centers/${code}`);
  }
}
