import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { authGuard } from './core/guards/auth.guard';

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
            {
                path: 'admin/audit-log',
                title: 'Audit Log',
                loadComponent: () => import('./features/admin/audit-log/audit-log.component').then((m) => m.AuditLogComponent),
            },
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
