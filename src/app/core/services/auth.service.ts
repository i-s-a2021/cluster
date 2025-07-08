import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface User {
  id: string;
  username: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }

  login(username: string, password: string): Observable<User> {
    // Mock login: In real app, call API
    const mockUser: User = {
      id: '1',
      username,
      roles: username === 'admin' ? ['admin', 'editor'] : ['author']
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    return of(mockUser);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return !!user && roles.some(r => user.roles.includes(r));
  }
} 