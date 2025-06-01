import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private roleService: RoleService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles: string[] = route.data['roles'] || [];
    if (requiredRoles.length === 0) {
      return true;
    }

    const userRole = this.roleService.getUserRole();
    if (userRole && requiredRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
