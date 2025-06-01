import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author } from './author.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private baseUrl = 'http://localhost:3000/authors';

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.baseUrl);
  }

  getAuthorById(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.baseUrl}/${id}`);
  }

  addAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(this.baseUrl, author);
  }

  updateAuthor(id: number, author: Author): Observable<Author> {
    return this.http.put<Author>(`${this.baseUrl}/${id}`, author);
  }

  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
