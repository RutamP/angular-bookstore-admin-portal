import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private authService: AuthService) {}

  getUserRole(): string | null {
    const user = this.authService.getCurrentUser();
    return user ? user.role : null;
  }

  isSuperAdmin(): boolean {
    return this.getUserRole() === 'superadmin';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isSalesPerson(): boolean {
    return this.getUserRole() === 'sales';
  }

  hasAccessToUsers(): boolean {
    return this.isSuperAdmin() || this.isAdmin();
  }

  hasAccessToBooks(): boolean {
    return this.isSuperAdmin() || this.isAdmin() || this.isSalesPerson();
  }

  hasAccessToAuthors(): boolean {
    return this.hasAccessToBooks();
  }
}
