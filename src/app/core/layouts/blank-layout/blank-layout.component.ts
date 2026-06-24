import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-blank-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css',
})
export class BlankLayoutComponent {
  private authStateService = inject(AuthStateService);
  private readonly router = inject(Router);

  user = signal({
    firstName: 'Guest',
    email: 'user@example.com',
  });

  showUserDropdown = signal(false);
  isAdmin = false;

  readonly mainLinks = [
    { label: 'Diplomas', route: '/diplomas' },
    { label: 'Account Settings', route: '/account' },
  ];

  constructor() {
    effect(() => {
      const currentUser = this.authStateService.getUser();
      if (currentUser) {
        this.user.set({
          firstName: currentUser.firstName,
          email: currentUser.email,
        });
      }
    });
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.update(value => !value);
  }

  closeDropdown(): void {
    this.showUserDropdown.set(false);
  }

  logout(): void {
    this.closeDropdown();
    this.authStateService.clearAuthState();
    this.router.navigate(['/login']);
  }
}

