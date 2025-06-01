import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Author } from '../author.model';
import { AuthorService } from '../author.service';
import { AuthorDialogComponent } from '../author-dialog/author-dialog.component';
import { CustomSnackbarComponent } from 'src/app/shared/custom-snackbar/custom-snackbar.component';
import { Book, BookService } from 'src/app/books/book.service';
import { Observable } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-authors-list',
  templateUrl: './authors-list.component.html',
  styleUrls: ['./authors-list.component.scss'],
})
export class AuthorsListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'bio', 'actions'];
  dataSource: MatTableDataSource<Author> = new MatTableDataSource<Author>();
  hoveredRow: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authorService: AuthorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private bookService: BookService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.fetchAuthors();
  }

  private showSnackBar(message: string, panelClass: string): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      data: { message, panelClass, snackBarRef: this.snackBar },
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

  fetchAuthors(): void {
    this.authorService.getAuthors().subscribe((authors) => {
      this.dataSource.data = authors;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(author?: Author): void {
    this.dialogService.openAuthorDialog(author || null, (result, isEdit) => {
      if (isEdit && result.id) {
        const { id, ...data } = result;
        this.authorService.updateAuthor(id, data).subscribe(() => {
          this.fetchAuthors();
          this.showSnackBar('Author updated successfully', 'snackbar-success');
        });
      } else {
        this.authorService.addAuthor(result).subscribe(() => {
          this.fetchAuthors();
          this.showSnackBar('Author added successfully', 'snackbar-success');
        });
      }
    });
  }

  deleteAuthor(id: number): void {
    this.bookService.getBooks().subscribe((response) => {
      const books: Book[] = response.body;

      if (!Array.isArray(books)) {
        console.error('Books is not an array:', books);
        return;
      }

      const hasLinkedBooks = books.some((book) => book.authorId === id);

      if (hasLinkedBooks) {
        this.showSnackBar(
          'Cannot delete: One or more books are linked to this author.',
          'snackbar-error'
        );
      } else {
        this.confirmDelete(
          'Delete Author',
          'Are you sure you want to delete this author?'
        ).subscribe((confirmed) => {
          if (confirmed) {
            this.authorService.deleteAuthor(id).subscribe(() => {
              this.fetchAuthors();
              this.showSnackBar(
                'Author deleted successfully',
                'snackbar-delete'
              );
            });
          }
        });
      }
    });
  }
}
