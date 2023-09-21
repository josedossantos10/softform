import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Question } from 'src/app/core/model/question';
import { Observable } from 'rxjs';

// TODO: handle http errors

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getQuestions(userId: string): Observable<Question[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: userId,
      }),
    };

    return this.http.get<Question[]>(`${this.baseUrl}/questions`, httpOptions);
  }
}
