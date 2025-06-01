import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsRoutingModule } from './authors-routing.module';
import { AuthorsComponent } from './authors.component';
import { AuthorsListComponent } from './authors-list/authors-list.component';
import { AuthorDialogComponent } from './author-dialog/author-dialog.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [AuthorsComponent, AuthorsListComponent, AuthorDialogComponent],
  imports: [
    CommonModule,
    AuthorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatCardModule,
    MatSortModule,
  ],
})
export class AuthorsModule {}
