import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AdminService {
    private readonly http = inject(HttpClient);

    getAuditLogs(params = new HttpParams()): Observable<unknown> {
        return this.http.get(`${environment.baseUrl}admin/audit-logs`, { params });
    }

    getUsers(params = new HttpParams()): Observable<unknown> {
        return this.http.get(`${environment.baseUrl}admin/users`, { params });
    }

    setDiplomaImmutable(id: string, immutable: boolean): Observable<unknown> {
        return this.http.patch(`${environment.baseUrl}admin/diplomas/${id}/immutable`, { immutable });
    }

    setExamImmutable(id: string, immutable: boolean): Observable<unknown> {
        return this.http.patch(`${environment.baseUrl}admin/exams/${id}/immutable`, { immutable });
    }

    setQuestionImmutable(id: string, immutable: boolean): Observable<unknown> {
        return this.http.patch(`${environment.baseUrl}admin/questions/${id}/immutable`, { immutable });
    }
}
