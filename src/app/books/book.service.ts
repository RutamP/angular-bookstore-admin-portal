import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Book {
  id: number;
  title: string;
  authorId: number;
  publishedDate: string;
  stock: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:3000/books';
  constructor(private http: HttpClient) {}

  getBooks(page: number = 1, limit: number = 5): Observable<any> {
    const params = new HttpParams().set('_page', page).set('_limit', limit);

    return this.http.get<Book[]>(this.apiUrl, {
      params,
      observe: 'response',
    });
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTotalBooks(): Observable<any> {
    return this.http.get<Book[]>(this.apiUrl, {
      observe: 'response',
    });
  }
}
