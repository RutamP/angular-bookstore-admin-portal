import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../../../users/edit-user-dialog/edit-user-dialog.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get username(): string | null {
    const user = this.authService.getCurrentUser();
    return user ? user.username : null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openEditUserDialog(): void {
    const user = this.authService.getCurrentUser();
    const username = user ? user.username : '';
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: { username },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.updatedUser) {
        this.authService.setCurrentUser(result.updatedUser);
      }
    });
  }
}
