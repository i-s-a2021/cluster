import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.setTheme(isDark);
  }

  isDarkMode() {
    return this.isDarkMode$.asObservable();
  }

  toggleTheme(): void {
    const currentTheme = this.isDarkMode$.value;
    this.setTheme(!currentTheme);
  }

  private setTheme(isDark: boolean): void {
    this.isDarkMode$.next(isDark);
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
