import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-edit-user-admin-dialog',
  templateUrl: './edit-user-admin-dialog.component.html',
  styleUrls: ['./edit-user-admin-dialog.component.scss'],
})
export class EditUserAdminDialogComponent implements OnInit {
  userForm!: FormGroup;
  allowedRoles: string[] = [];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.setAllowedRoles();

    this.userForm = this.fb.group({
      username: [this.data?.username || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      password: [this.data?.password || '', Validators.required],
      role: [this.data?.role || this.allowedRoles[0], Validators.required],
    });
  }

  setAllowedRoles(): void {
    if (this.roleService.isSuperAdmin()) {
      this.allowedRoles = ['superadmin', 'admin', 'sales'];
    } else if (this.roleService.isAdmin()) {
      this.allowedRoles = ['sales'];
    }
  }

  save(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      this.dialogRef.close({ ...this.data, ...formData });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
