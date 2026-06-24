import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { adminGuard, authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        loadComponent: () =>
            import('./core/layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
        children: [...AUTH_ROUTES],
    },
    {
        path: '',
        loadComponent: () =>
            import('./core/layouts/blank-layout/blank-layout.component').then((m) => m.BlankLayoutComponent),
        canActivateChild: [authGuard],
        children: [
            {
                path: 'diplomas',
                title: 'Diplomas',
                loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
            },
            {
                path: 'diplomas/:diplomaId/exams',
                title: 'Exams',
                loadComponent: () => import('./features/exams/exams.component').then((m) => m.ExamsComponent),
            },
            {
                path: 'exams/:examId/questions',
                title: 'Exam Questions',
                loadComponent: () =>
                    import('./features/exam-questions/exam-questions.component').then((m) => m.ExamQuestionsComponent),
            },
            {
                path: 'exams/:examId/results',
                title: 'Exam Answers',
                loadComponent: () =>
                    import('./features/exam-results/exam-results.component').then((m) => m.ExamResultsComponent),
            },
            {
                path: 'admin/audit-log',
                canActivate: [adminGuard],
                title: 'Audit Log',
                loadComponent: () => import('./features/admin/audit-log/audit-log.component').then((m) => m.AuditLogComponent),
            },
            {
                path: 'admin/diplomas',
                title: 'Manage Diplomas',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/admin/diplomas/diplomas.component').then((m) => m.DiplomasComponent),
            },
            {
                path: 'admin/exams',
                title: 'Manage Exams',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/admin/exams-management/exams-management.component').then((m) => m.ExamsManagementComponent),
            },
            {
                path: 'admin/questions',
                title: 'Manage Questions',
                canActivate: [adminGuard],
                loadComponent: () => import('./features/admin/questions-management/questions-management.component').then((m) => m.QuestionsManagementComponent),
            },
            {
                path: 'account',
                title: 'Account Settings',
                loadComponent: () =>
                    import('./features/account-settings/account-settings.component').then((m) => m.AccountSettingsComponent),
            },
        ],
    },
    {
        path: '**',
        title: '404 - Not Found',
        loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    },
];
