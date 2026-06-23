import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

export const authGuard: CanActivateChildFn = (_, state) => {
    const authState = inject(AuthStateService);
    const router = inject(Router);

    if (authState.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const adminGuard: CanActivateChildFn = () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);
    const role = authState.getUser()?.role;

    return role === 'ADMIN' || role === 'SUPER_ADMIN' ? true : router.createUrlTree(['/diplomas']);
};
