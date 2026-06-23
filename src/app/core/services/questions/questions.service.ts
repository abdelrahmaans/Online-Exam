import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { QuestionsResponse } from '../../models/question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {

  private readonly _httpClient = inject(HttpClient);

  getExamQuestions(examId: string): Observable<QuestionsResponse> {
    return this._httpClient.get<QuestionsResponse>(environment.baseUrl + `questions/exam/${examId}`);
  }
  getQuestionById(questionId: string): Observable<QuestionsResponse> {
    return this._httpClient.get<QuestionsResponse>(environment.baseUrl + `questions/${questionId}`);
  }

}
