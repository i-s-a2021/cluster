import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T> {
  protected items$ = new BehaviorSubject<T[]>([]);
  protected loading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadInitialData();
  }

  protected abstract getInitialData(): T[];
  protected abstract generateId(): string;

  private loadInitialData(): void {
    this.loading$.next(true);
    setTimeout(() => {
      this.items$.next(this.getInitialData());
      this.loading$.next(false);
    }, 500);
  }

  getAll(): Observable<T[]> {
    return this.items$.asObservable();
  }

  getById(id: string): Observable<T | undefined> {
    return this.items$.pipe(
      map(items => items.find((item: any) => item.id === id))
    );
  }

  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<T> {
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as T;

    const currentItems = this.items$.getValue();
    this.items$.next([...currentItems, newItem]);

    return of(newItem).pipe(delay(200));
  }

  update(id: string, updates: Partial<T>): Observable<T | null> {
    const currentItems = this.items$.getValue();
    const index = currentItems.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      return of(null);
    }

    const updatedItem = {
      ...currentItems[index],
      ...updates,
      updatedAt: new Date()
    } as T;

    const newItems = [...currentItems];
    newItems[index] = updatedItem;
    this.items$.next(newItems);

    return of(updatedItem).pipe(delay(200));
  }

  delete(id: string): Observable<boolean> {
    const currentItems = this.items$.getValue();
    const filteredItems = currentItems.filter((item: any) => item.id !== id);
    
    if (filteredItems.length === currentItems.length) {
      return of(false);
    }

    this.items$.next(filteredItems);
    return of(true).pipe(delay(200));
  }

  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
