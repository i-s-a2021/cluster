import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../core/services/auth.service';

export interface HeaderBrand {
  logo: string;
  text: string;
  route: string;
}

export interface HeaderNavItem {
  text: string;
  icon: string;
  route: string;
  permission?: string | string[];
  active?: boolean;
}

export interface HeaderUserAction {
  text: string;
  icon: string;
  action: 'logout' | 'login' | 'profile' | 'settings' | 'custom';
  route?: string;
  customAction?: () => void;
  permission?: string | string[];
}

export interface HeaderConfig {
  brand: HeaderBrand;
  navItems: HeaderNavItem[];
  userActions: HeaderUserAction[];
  showThemeToggle?: boolean;
  showMobileMenu?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() config: HeaderConfig = {
    brand: {
      logo: 'fas fa-plane-departure',
      text: 'Airports Portal',
      route: '/dashboard'
    },
    navItems: [
      { text: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
      { text: 'News', icon: 'fas fa-newspaper', route: '/news', permission: ['admin','editor','author'] },
      { text: 'Users', icon: 'fas fa-users', route: '/users', permission: ['admin','editor'] }
    ],
    userActions: [
      { text: 'Login', icon: 'fas fa-sign-in-alt', action: 'login', route: '/login' },
      { text: 'Logout', icon: 'fas fa-sign-out-alt', action: 'logout', permission: ['admin','editor','author','user'] }
    ],
    showThemeToggle: true,
    showMobileMenu: true
  };

  isCollapsed = true;
  isDarkMode$: Observable<boolean>;
  currentLang = 'en';
  private userSub?: Subscription;
  userRoles: string[] = [];

  constructor(
    public auth: AuthService,
    public themeService: ThemeService,
    public translate: TranslateService
  ) {
    this.isDarkMode$ = this.themeService.isDarkMode();
    // Set up supported languages
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.currentLang = browserLang && ['en', 'ar'].includes(browserLang) ? browserLang : 'en';
    this.translate.use(this.currentLang);
   
  }

  ngOnInit() {
    this.userSub = this.auth.currentUser$.subscribe((user: User | null) => {
      this.userRoles = user?.roles || [];
    });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
    console.log('Mobile menu toggled, isCollapsed:', this.isCollapsed);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  handleUserAction(action: HeaderUserAction): void {
    switch (action.action) {
      case 'logout':
        this.auth.logout();
        break;
      case 'login':
        // Navigation will be handled by routerLink
        break;
      case 'custom':
        if (action.customAction) {
          action.customAction();
        }
        break;
      default:
        // Handle other actions as needed
        break;
    }
  }

  hasPermission(item: HeaderNavItem | HeaderUserAction): boolean {
    if (!item.permission) return true;
    
    const requiredRoles = Array.isArray(item.permission) ? item.permission : [item.permission];
    
    return requiredRoles.some(role => this.userRoles.includes(role));
  }

  switchLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  
  }



  // Helper method to create a minimal header configuration
  static createMinimalConfig(): HeaderConfig {
    return {
      brand: {
        logo: 'fas fa-home',
        text: 'Simple App',
        route: '/'
      },
      navItems: [
        { text: 'Home', icon: 'fas fa-home', route: '/' },
        { text: 'About', icon: 'fas fa-info-circle', route: '/about' }
      ],
      userActions: [
        { text: 'Login', icon: 'fas fa-sign-in-alt', action: 'login', route: '/login' }
      ],
      showThemeToggle: true,
      showMobileMenu: true
    };
  }

  // Helper method to create a news-focused header configuration
  static createNewsConfig(): HeaderConfig {
    return {
      brand: {
        logo: 'fas fa-newspaper',
        text: 'News Portal',
        route: '/news'
      },
      navItems: [
        { text: 'Latest News', icon: 'fas fa-clock', route: '/news' },
        { text: 'Categories', icon: 'fas fa-tags', route: '/news/categories' },
        { text: 'Popular', icon: 'fas fa-fire', route: '/news/popular' },
        { text: 'Archived', icon: 'fas fa-archive', route: '/news/archived', permission: ['admin','editor'] }
      ],
      userActions: [
        { text: 'Login', icon: 'fas fa-sign-in-alt', action: 'login', route: '/login' },
        { text: 'Logout', icon: 'fas fa-sign-out-alt', action: 'logout', permission: ['admin','editor','author','user'] }
      ],
      showThemeToggle: true,
      showMobileMenu: true
    };
  }
}
