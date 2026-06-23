import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'register',
        title: 'Register',
        loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
    },
    {
        path: 'create-account',
        title: 'Create Account',
        loadComponent: () => import('./create-account/create-account.component').then((m) => m.CreateAccountComponent),
    },
    {
        path: 'forget-password',
        title: 'Forgot Password',
        loadComponent: () => import('./forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
    },
    {
        path: 'verify-otp',
        title: 'Verify Email',
        loadComponent: () => import('./verify-otp/verify-otp.component').then((m) => m.VerifyOtpComponent),
    },
    {
        path: 'reset-password',
        title: 'Reset Password',
        loadComponent: () => import('./reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
    },
];
