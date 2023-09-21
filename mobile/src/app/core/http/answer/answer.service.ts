import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../../model/answer';

// TODO: handle http errors

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  async saveAnswer(answer: Answer) {
    return await this.http.put(`${this.baseUrl}/answers`, answer);
  }
}
