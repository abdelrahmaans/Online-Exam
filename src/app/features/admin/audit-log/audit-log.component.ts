import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin/admin.service';

interface AuditLogEntry {
    id: string;
    action: string;
    entityType: string;
    actorUsername: string;
    createdAt: string;
}

@Component({
    selector: 'app-audit-log',
    imports: [DatePipe],
    templateUrl: './audit-log.component.html',
    styleUrl: './audit-log.component.css',
})
export class AuditLogComponent implements OnInit {
    private readonly adminService = inject(AdminService);

    entries: AuditLogEntry[] = [];
    isLoading = true;
    errorMessage = '';

    ngOnInit(): void {
        this.adminService.getAuditLogs().subscribe({
            next: (response) => {
                this.entries = ((response as { payload?: { data?: AuditLogEntry[] } }).payload?.data) ?? [];
                this.isLoading = false;
            },
            error: () => {
                this.errorMessage = 'Unable to load the audit log.';
                this.isLoading = false;
            },
        });
    }
}
