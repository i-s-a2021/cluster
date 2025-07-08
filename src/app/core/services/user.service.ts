import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { User, UserFilter } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {
  
  protected getInitialData(): User[] {
    return [
      {
        id: '1',
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: 'password',
        image: '',
        roles: ['admin'],
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: '2',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password',
        image: '',
        roles: ['editor'],
        isActive: true,
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02')
      },
      {
        id: '3',
        name: 'Carol Lee',
        email: 'carol@example.com',
        password: 'password',
        image: '',
        roles: ['author'],
        isActive: false,
        createdAt: new Date('2023-01-03'),
        updatedAt: new Date('2023-01-03')
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david.kim@cluster2airports.com',
        password: 'password',
        image: '',
        roles: ['author'],
        isActive: true,
        createdAt: new Date('2024-04-05'),
        updatedAt: new Date('2024-04-05')
      },
      {
        id: '5',
        name: 'Emma Thompson',
        email: 'emma.thompson@cluster2airports.com',
        password: 'password',
        image: '',
        roles: ['author'],
        isActive: true,
        createdAt: new Date('2024-05-12'),
        updatedAt: new Date('2024-05-12')
      },
      {
        id: '6',
        name: 'Robert Wilson',
        email: 'robert.wilson@cluster2airports.com',
        password: 'password',
        image: '',
        roles: ['editor'],
        isActive: false,
        createdAt: new Date('2024-06-18'),
        updatedAt: new Date('2024-06-18')
      }
    ];
  }

  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getFiltered(filter: UserFilter): Observable<User[]> {
    return this.getAll().pipe(
      map(users => {
        let filtered = users;

        if (filter.searchTerm) {
          const searchLower = filter.searchTerm.toLowerCase();
          filtered = filtered.filter(user => 
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
          );
        }

        if (filter.role) {
          filtered = filtered.filter(user => user.roles && Array.isArray(user.roles) && filter.role && user.roles.includes(filter.role));
        }

        if (filter.isActive !== undefined) {
          filtered = filtered.filter(user => user.isActive === filter.isActive);
        }

        return filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
    );
  }

  getActiveUsersCount(): Observable<number> {
    return this.getAll().pipe(
      map(users => users.filter(user => user.isActive).length)
    );
  }

  getAdminCount(): Observable<number> {
    return this.getAll().pipe(
      map(users => users.filter(user => user.roles.includes('admin')).length)
    );
  }

  getInactiveCount(): Observable<number> {
    return this.getAll().pipe(
      map(users => users.filter(user => !user.isActive).length)
    );
  }

  toggleUserStatus(id: string): Observable<User | null> {
    const currentUsers = this.items$.getValue();
    const index = currentUsers.findIndex(user => user.id === id);
    if (index === -1) return of(null);
    const updatedUser = {
      ...currentUsers[index],
      isActive: !currentUsers[index].isActive,
      updatedAt: new Date()
    };
    const newUsers = [...currentUsers];
    newUsers[index] = updatedUser;
    this.items$.next(newUsers);
    return of(updatedUser);
  }

  // Observable for loading state
  get isLoading$(): Observable<boolean> {
    return this.isLoading();
  }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    const currentUsers = this.items$.getValue();
    this.items$.next([...currentUsers, newUser]);
    return of(newUser);
  }

  getAvailableRoles(): Observable<string[]> {
    // You can make this dynamic if needed
    return of(['admin', 'editor', 'author', 'viewer']);
  }

  deleteUser(id: string): Observable<boolean> {
    const currentUsers = this.items$.getValue();
    const filteredUsers = currentUsers.filter(user => user.id !== id);
    if (filteredUsers.length === currentUsers.length) {
      return of(false);
    }
    this.items$.next(filteredUsers);
    return of(true);
  }

  restoreUser(user: User): void {
    const currentUsers = this.items$.getValue();
    this.items$.next([user, ...currentUsers]);
  }
}
