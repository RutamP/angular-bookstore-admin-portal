import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EditBookDialogComponent } from '../books/edit-book-dialog/edit-book-dialog.component';
import { EditUserAdminDialogComponent } from '../users/edit-user-admin-dialog/edit-user-admin-dialog.component';
import { AuthorDialogComponent } from '../authors/author-dialog/author-dialog.component';

import { Book } from '../books/book.service';
import { User } from '../users/user.service';
import { Author } from '../authors/author.model';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openBookDialog(
    book: Book | null,
    onSave: (result: Book, isEdit: boolean) => void
  ): void {
    const isEdit = !!book;
    const dialogRef = this.dialog.open(EditBookDialogComponent, {
      width: '400px',
      data: book || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        onSave(result, isEdit);
      }
    });
  }

  openUserDialog(
    user: User | null,
    onSave: (result: User, isEdit: boolean) => void
  ): void {
    const isEdit = !!user;
    const dialogRef = this.dialog.open(EditUserAdminDialogComponent, {
      width: '400px',
      data: user || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        onSave(result, isEdit);
      }
    });
  }

  openAuthorDialog(
    author: Author | null,
    onSave: (result: Author, isEdit: boolean) => void
  ): void {
    const isEdit = !!author;
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      width: '400px',
      data: author || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        onSave(result, isEdit);
      }
    });
  }
}
