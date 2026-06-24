import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Question, QuestionsResponse } from '../../models/question.interface';

export interface QuestionAnswerPayload {
  text: string;
  isCorrect: boolean;
}

export interface QuestionPayload {
  text: string;
  answers: QuestionAnswerPayload[];
}

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {

  private readonly _httpClient = inject(HttpClient);

  getExamQuestions(examId: string, params?: { search?: string; sortBy?: 'title' | 'createdAt'; sortOrder?: 'asc' | 'desc'; immutable?: boolean }): Observable<QuestionsResponse> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search.trim());
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    if (typeof params?.immutable === 'boolean') httpParams = httpParams.set('immutable', String(params.immutable));

    return this._httpClient.get<QuestionsResponse>(environment.baseUrl + `questions/exam/${examId}`, { params: httpParams });
  }

  getQuestionById(questionId: string): Observable<{ status?: boolean; code?: number; question?: Question; payload?: { question?: Question } }> {
    return this._httpClient.get<{ status?: boolean; code?: number; question?: Question; payload?: { question?: Question } }>(environment.baseUrl + `questions/${questionId}`);
  }

  createQuestion(examId: string, payload: QuestionPayload): Observable<unknown> {
    return this._httpClient.post(environment.baseUrl + `questions/exam/${examId}`, payload);
  }

  createQuestionWithExamId(examId: string, payload: QuestionPayload): Observable<unknown> {
    return this._httpClient.post(environment.baseUrl + 'questions', { ...payload, examId });
  }

  bulkCreateQuestions(examId: string, questions: QuestionPayload[]): Observable<unknown> {
    return this._httpClient.post(environment.baseUrl + `questions/exam/${examId}/bulk`, { questions });
  }

  updateQuestion(questionId: string, payload: QuestionPayload): Observable<unknown> {
    return this._httpClient.put(environment.baseUrl + `questions/${questionId}`, payload);
  }

  deleteQuestion(questionId: string): Observable<unknown> {
    return this._httpClient.delete(environment.baseUrl + `questions/${questionId}`);
  }

}
