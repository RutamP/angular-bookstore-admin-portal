import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService, User } from '../user.service';
import { RoleService } from '../../services/role.service';
import { CustomSnackbarComponent } from 'src/app/shared/custom-snackbar/custom-snackbar.component';
import { Observable } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  hoveredRow: number | null = null;
  currentUserRole: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.roleService.getUserRole() || '';
    this.fetchUsers();
  }

  private showSnackBar(message: string, panelClass: string): void {
    const ref = this.snackBar.openFromComponent(CustomSnackbarComponent, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data: {
        message,
        panelClass,
        snackBarRef: this.snackBar,
      },
      panelClass: ['no-default-style'],
    });
  }

  private confirmDelete(title: string, message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title,
        message,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      } as ConfirmDialogData,
    });

    return dialogRef.afterClosed();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  canEditUser(user: User): boolean {
    const currentUserRole = this.roleService.getUserRole();
    if (!currentUserRole) return false;

    if (currentUserRole === 'superadmin') {
      return user.role !== 'superadmin';
    }

    if (currentUserRole === 'admin') {
      return user.role === 'sales';
    }

    return false;
  }

  canDeleteUser(user: User): boolean {
    if (this.roleService.isSuperAdmin()) {
      return user.role !== 'superadmin';
    }
    if (this.roleService.isAdmin()) {
      return user.role === 'sales';
    }
    return false;
  }

  canAddUser(): boolean {
    return this.roleService.isSuperAdmin() || this.roleService.isAdmin();
  }

  deleteUser(user: User): void {
    this.confirmDelete(
      'Delete User',
      `Are you sure you want to delete ${user.username}?`
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(user.id).subscribe(() => {
          this.fetchUsers();
          this.showSnackBar('User deleted successfully', 'snackbar-delete');
        });
      }
    });
  }

  openAddDialog(user?: User): void {
    this.dialogService.openUserDialog(user || null, (result, isEdit) => {
      if (isEdit) {
        const { id, ...userData } = result;
        this.userService.updateUser(id, userData).subscribe(() => {
          this.fetchUsers();
          this.showSnackBar('User updated successfully', 'snackbar-success');
        });
      } else {
        this.userService.addUser(result).subscribe(() => {
          this.fetchUsers();
          this.showSnackBar('User added successfully', 'snackbar-success');
        });
      }
    });
  }
}
