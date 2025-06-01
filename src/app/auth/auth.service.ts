import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';

export interface UserSummary {
  username: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API = 'http://localhost:3000/users';

  private currentUserSubject = new BehaviorSubject<UserSummary | null>(
    this.getCurrentUserFromLocalStorage()
  );

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .get<any[]>(`${this.API}?username=${username}&password=${password}`)
      .pipe(
        tap((users) => {
          if (users.length) {
            const user = users[0];
            if (user.token) {
              localStorage.setItem('token', user.token);
            }
            const userSummary: UserSummary = {
              username: user.username,
              name: user.name,
              role: user.role,
            };
            localStorage.setItem('currentUser', JSON.stringify(userSummary));
            this.currentUserSubject.next(userSummary);
          } else {
            throw new Error('Invalid credentials');
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('currentUser');
  }

  getToken() {
    return localStorage.getItem('token') || '';
  }

  setCurrentUser(user: any) {
    const userSummary: UserSummary = {
      username: user.username,
      name: user.name,
      role: user.role,
    };
    localStorage.setItem('currentUser', JSON.stringify(userSummary));
    this.currentUserSubject.next(userSummary);
  }

  getCurrentUser(): UserSummary | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserObservable() {
    return this.currentUserSubject.asObservable();
  }

  private getCurrentUserFromLocalStorage(): UserSummary | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? (JSON.parse(userJson) as UserSummary) : null;
  }
}
