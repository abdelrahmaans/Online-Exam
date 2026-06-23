import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { SubmissionPayload, SubmissionResponse } from '../../models/question.interface';

@Injectable({
    providedIn: 'root',
})
export class SubmissionsService {

    private readonly _httpClient = inject(HttpClient);

    submitExam(payload: SubmissionPayload): Observable<SubmissionResponse> {

    getMySubmissions(): Observable<unknown> {
        return this._httpClient.get(environment.baseUrl + 'submissions');
    }

    getSubmissionById(id: string): Observable<unknown> {
        return this._httpClient.get(environment.baseUrl + `submissions/${id}`);
        return this._httpClient.post<SubmissionResponse>(environment.baseUrl + 'submissions', payload);
    }

}
