import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Book, BookService } from '../book.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../../services/role.service';
import { AuthorService } from '../../authors/author.service';
import { Author } from '../../authors/author.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from 'src/app/shared/custom-snackbar/custom-snackbar.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'author',
    'publishedDate',
    'stock',
    'actions',
  ];
  dataSource: MatTableDataSource<Book> = new MatTableDataSource<Book>();
  authors: Author[] = [];
  hoveredRow: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private router: Router,
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadAuthorsAndBooks();
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

  loadAuthorsAndBooks(): void {
    this.authorService.getAuthors().subscribe((authors) => {
      this.authors = authors;
      this.fetchBooks();
    });
  }

  fetchBooks(): void {
    this.bookService.getBooks(1, 1000).subscribe((response) => {
      const books: Book[] = response.body || [];

      books.forEach((book: Book) => {
        const author = this.authors.find((a) => a.id === book.authorId);
        (book as any).authorName = author ? author.name : 'Unknown';
      });

      this.dataSource.data = books;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getAuthorName(authorId: number): string {
    const author = this.authors.find((a) => a.id === authorId);
    return author ? author.name : 'Unknown';
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditDialog(book?: Book): void {
    this.dialogService.openBookDialog(book || null, (result, isEdit) => {
      if (result) {
        if (isEdit) {
          this.bookService.updateBook(result.id, result).subscribe(() => {
            this.loadAuthorsAndBooks();
            this.showSnackBar('Book updated successfully', 'snackbar-success');
          });
        } else {
          this.bookService.createBook(result).subscribe(() => {
            this.loadAuthorsAndBooks();
            this.showSnackBar('Book added successfully', 'snackbar-success');
          });
        }
      }
    });
  }

  deleteBook(id: number): void {
    this.confirmDelete(
      'Delete Book',
      'Are you sure you want to delete this book?'
    ).subscribe((confirmed) => {
      if (confirmed) {
        this.bookService.deleteBook(id).subscribe(() => {
          this.loadAuthorsAndBooks();
          this.showSnackBar('Book deleted successfully', 'snackbar-delete');
        });
      }
    });
  }

  canEditBooks(): boolean {
    return this.roleService.hasAccessToBooks();
  }
}
