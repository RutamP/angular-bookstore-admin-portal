import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
})
export class EditUserDialogComponent implements OnInit {
  editForm: FormGroup;
  userId!: number;
  originalUser!: User;

  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { username: string },
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.editForm = this.fb.group({
      username: [data.username, Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.http
      .get<User[]>(`http://localhost:3000/users?username=${this.data.username}`)
      .subscribe((users) => {
        if (users.length) {
          this.originalUser = users[0];
          this.userId = this.originalUser.id;
          this.editForm.patchValue({
            username: this.originalUser.username,
            password: this.originalUser.password,
          });
        }
      });
  }

  saveChanges(): void {
    if (this.editForm.invalid || !this.userId) return;

    const updatedFields = this.editForm.value;

    const updatedUser: User = {
      ...this.originalUser,
      ...updatedFields,
    };

    this.http
      .put(`http://localhost:3000/users/${this.userId}`, updatedUser)
      .subscribe({
        next: () => {
          this.authService.setCurrentUser(updatedUser);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Error updating details');
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
