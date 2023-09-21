import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserAdmin } from '../../model/userAdmin';
import { User } from '../../model/user';

// TODO: handle http errors

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  logInUser(userCode: User) {
    return this.http.post(`${this.baseUrl}/sessions`, userCode);
  }

  registerUser(user: User) {
    return this.http.post(`${this.baseUrl}/users/register`, user);
  }

  registerNetworking(user: User) {
    return this.http.post(`${this.baseUrl}/users/networking`, user);
  }

  setFinished(user: User) {
    return this.http.post(`${this.baseUrl}/users/finish`, {
      id: user.id,
      finishedAt: user.finishedAt,
    });
  }

  setAcceptedTerms(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users/accept`, {
      id: user.id,
    });
  }

  setUser(user: User, admin: UserAdmin, operation: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users-manager-set`, {
      id: admin.id,
      password: admin.password,
      user,
      operation,
    });
  }

  getUser(id: string, admin: UserAdmin): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users-manager`, {
      adminId: admin.id,
      password: admin.password,
      id,
    });
  }

  sendUserIdToOuterSystem(id: string): Observable<unknown> {
    return this.http.get(
      `https://<your_link>?cod=${id}`,
    );
  }

  logOuterSystemResponse(
    id: string,
    timestamp: Date,
    response: unknown,
  ): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/log/outer-response`, {
      user_id: id,
      timestamp,
      message: response,
    });
  }
}
