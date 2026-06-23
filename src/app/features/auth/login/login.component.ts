import { AuthService } from 'auth';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { AuthButtonComponent } from '../../../shared/components/auth-button/auth-button.component';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';
import { InputErrorMessageComponent } from '../../../shared/components/input-error-message/input-error-message.component';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink, AuthButtonComponent, ErrorBannerComponent, InputErrorMessageComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {

    private readonly _authService = inject(AuthService);
    private readonly _authStateService = inject(AuthStateService);
    private readonly _route = inject(ActivatedRoute);
    private readonly _router = inject(Router);

    private fb = inject(FormBuilder);

    showPassword = false;
    isSubmitAttempted = false;
    authErrorMessage = '';
    authInfoMessage = '';

    loginForm: FormGroup = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
    });

    constructor() {
        const created = this._route.snapshot.queryParamMap.get('created');
        const username = this._route.snapshot.queryParamMap.get('username');

        if (username) {
            this.loginForm.patchValue({ username: username.trim() });
        }

        if (created === '1') {
            this.authInfoMessage = 'Account created. Login using your username and password.';
        }
    }

    get usernameControl(): AbstractControl {
        return this.loginForm.get('username')!;
    }

    get passwordControl(): AbstractControl {
        return this.loginForm.get('password')!;
    }

    get shouldShowUsernameError() {
        return this.usernameControl.invalid && (this.usernameControl.touched || this.isSubmitAttempted);
    }

    get shouldShowPasswordError() {
        return this.passwordControl.invalid && (this.passwordControl.touched || this.isSubmitAttempted);
    }

    get shouldShowFormError() {
        return this.loginForm.invalid && this.isSubmitAttempted;
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    private extractLoginPayload(response: any): { user: any; token: string } | null {
        const directUser = response?.user;
        const directToken = response?.token;

        if (directUser && directToken) {
            return { user: directUser, token: directToken };
        }

        const wrappedUser = response?.payload?.user;
        const wrappedToken = response?.payload?.token;

        if (wrappedUser && wrappedToken) {
            return { user: wrappedUser, token: wrappedToken };
        }

        return null;
    }

    onSubmit() {
        this.isSubmitAttempted = true;
        this.loginForm.markAllAsTouched();
        this.authErrorMessage = '';
        this.authInfoMessage = '';

        if (this.loginForm.invalid) {
            return;
        }

        const payload = {
            username: (this.usernameControl.value ?? '').trim(),
            password: this.passwordControl.value ?? '',
        };

        this._authService.login(payload).subscribe({
            next: (response: any) => {
                console.log('Login successful:', response);

                const loginPayload = this.extractLoginPayload(response);

                // Check if login was accepted (API returns user data and token on success)
                if (loginPayload) {
                    // Store user data and token in auth state service
                    this._authStateService.setAuthState(loginPayload.user, loginPayload.token);

                    const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl');
                    this._router.navigateByUrl(returnUrl || '/diplomas');
                    return;
                }

                // Handle invalid response structure
                console.error('Login API returned invalid payload:', response);
                this.authErrorMessage = 'Login failed. Please try again.';
            },
            error: (error) => {
                console.error('Login API error:', error);
                // Extract error message from API response or use fallback
                this.authErrorMessage =
                    error?.error?.message ??
                    error?.message ??
                    'Login failed. Please try again.';
            }
        });
    }
}
