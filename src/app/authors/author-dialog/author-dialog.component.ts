import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Author } from '../author.model';

@Component({
  selector: 'app-author-dialog',
  templateUrl: './author-dialog.component.html',
  styleUrls: ['./author-dialog.component.scss'],
})
export class AuthorDialogComponent implements OnInit {
  authorForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuthorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Author | null
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.authorForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      bio: [
        this.data?.bio || '',
        [Validators.required, Validators.minLength(10)],
      ],
    });
  }

  onSubmit(): void {
    if (this.authorForm.invalid) return;

    const formData = this.authorForm.value;

    this.dialogRef.close(
      this.isEditMode ? { ...this.data, ...formData } : formData
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
