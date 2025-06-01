import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../book.service';
import { Author } from '../../authors/author.model';
import { AuthorService } from '../../authors/author.service';

@Component({
  selector: 'app-edit-book-dialog',
  templateUrl: './edit-book-dialog.component.html',
  styleUrls: ['./edit-book-dialog.component.scss'],
})
export class EditBookDialogComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode = false;
  authors: Author[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book | null,
    private authorService: AuthorService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.authorService.getAuthors().subscribe((authors) => {
      this.authors = authors;
    });

    this.bookForm = this.fb.group({
      title: [this.data?.title || '', Validators.required],
      authorId: [this.data?.authorId || '', Validators.required],
      publishedDate: [this.data?.publishedDate || '', Validators.required],
      stock: [this.data?.stock ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) return;

    const formValue = this.bookForm.value;

    this.dialogRef.close(
      this.isEditMode ? { ...this.data, ...formValue } : formValue
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
