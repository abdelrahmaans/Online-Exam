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
  createQuestion(examId: string, payload: { text: string; answers: { text: string; isCorrect: boolean }[] }): Observable<unknown> {
    return this._httpClient.post(environment.baseUrl + `questions/exam/${examId}`, payload);
  }

  createQuestionsBulk(examId: string, questions: { text: string; answers: { text: string; isCorrect: boolean }[] }[]): Observable<unknown> {
    return this._httpClient.post(environment.baseUrl + `questions/exam/${examId}/bulk`, { questions });
  }

  updateQuestion(id: string, payload: { text?: string; answers?: { text: string; isCorrect: boolean }[] }): Observable<unknown> {
    return this._httpClient.patch(environment.baseUrl + `questions/${id}`, payload);
  }

  deleteQuestion(id: string): Observable<unknown> {
    return this._httpClient.delete(environment.baseUrl + `questions/${id}`);
  }

}
