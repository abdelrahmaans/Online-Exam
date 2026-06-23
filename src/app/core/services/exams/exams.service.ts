import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Exams } from '../../models/exams.interface';

@Injectable({
  providedIn: 'root',
})
export class ExamsService {

  private readonly _httpClient = inject(HttpClient)


  getDiplomaExams(id: string): Observable<Exams> {
    const params = new HttpParams().set('diplomaId', id);
    return this._httpClient.get<Exams>(environment.baseUrl + 'exams', { params });
  }

}
