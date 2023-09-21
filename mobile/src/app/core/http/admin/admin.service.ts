import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserAdmin } from '../../model/userAdmin';

// TODO: handle http errors

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  logInAdmin(admin: UserAdmin) {
    return this.http.post(`${this.baseUrl}/admin_sessions`, admin);
  }
}
