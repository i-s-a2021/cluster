import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, HeaderConfig } from './shared/components/header/header.component';
import { FooterComponent, FooterConfig } from './shared/components/footer/footer.component';
import { GlobalLoadingComponent } from './shared/components/global-loading/global-loading.component';
import { SidebarComponent, SidebarConfig } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, GlobalLoadingComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project-port';
  
  // Legacy sidebar items for backward compatibility
  sidebarItems = [
    { label: 'Dashboard', icon: 'fa-tachometer-alt', route: '/dashboard' },
    { label: 'Statistics', icon: 'fa-chart-bar', route: '/statistics', permission: ['admin','editor','author'] },
    { label: 'News', icon: 'fa-newspaper', route: '/news', permission: ['admin','editor','author'] },
    { label: 'Users', icon: 'fa-users', route: '/users', permission: ['admin','editor'], children: [
      { label: 'View Users', icon: 'fa-users', route: '/users', permission: ['admin','editor'] },
      { label: 'Add User', icon: 'fa-user-plus', route: '/users/add', permission: 'admin' }
    ]}
  ];

  sidebarConfig: SidebarConfig = {
    items: [
      { label: 'Dashboard', icon: 'fa-tachometer-alt', route: '/dashboard' },
      { label: 'Statistics', icon: 'fa-chart-bar', route: '/statistics', permission: ['admin','editor','author'] },
      { label: 'News', icon: 'fa-newspaper', route: '/news', permission: ['admin','editor','author'] },
      { label: 'Users', icon: 'fa-users', route: '/users', permission: ['admin','editor'], children: [
        { label: 'View Users', icon: 'fa-users', route: '/users', permission: ['admin','editor'] },
        { label: 'Add User', icon: 'fa-user-plus', route: '/users/add', permission: 'admin' }
      ]}
    ],
    userRoles: [],
    collapsed: false,
    showToggle: true,
    showBadges: true,
    expandOnHover: false,
    theme: 'auto'
  };

  headerConfig: HeaderConfig = {
    brand: {
      logo: 'fas fa-plane-departure',
      text: 'Airports Portal',
      route: '/dashboard'
    },
    navItems: [
      { text: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
      { text: 'News', icon: 'fas fa-newspaper', route: '/news', permission: ['admin','editor','author'] },
      { text: 'Users', icon: 'fas fa-users', route: '/users', permission: ['admin','editor'] },
      { text: 'Statistics', icon: 'fas fa-chart-bar', route: '/statistics', permission: ['admin','editor','author'] }
    ],
    userActions: [
      { text: 'Login', icon: 'fas fa-sign-in-alt', action: 'login', route: '/login' },
      { text: 'Logout', icon: 'fas fa-sign-out-alt', action: 'logout', permission: ['admin','editor','author','user'] }
    ],
    showThemeToggle: true,
    showMobileMenu: true
  };

  footerConfig: FooterConfig = {
    brand: {
      logo: 'fas fa-plane-departure',
      title: 'Airports Portal',
      description: 'Your gateway to comprehensive airport management and information'
    },
    sections: [
      {
        title: 'Quick Links',
        links: [
          { text: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
          { text: 'News', icon: 'fas fa-newspaper', route: '/news' },
          { text: 'Users', icon: 'fas fa-users', route: '/users' },
          { text: 'Statistics', icon: 'fas fa-chart-bar', route: '/statistics' }
        ]
      },
      {
        title: 'Support',
        links: [
          { text: 'Help Center', icon: 'fas fa-question-circle', url: '#', external: true },
          { text: 'Contact Us', icon: 'fas fa-envelope', url: '#', external: true },
          { text: 'Documentation', icon: 'fas fa-book', url: '#', external: true }
        ]
      }
    ],
    socialLinks: [
      { icon: 'fab fa-twitter', url: '#', label: 'Twitter' },
      { icon: 'fab fa-linkedin', url: '#', label: 'LinkedIn' },
      { icon: 'fab fa-github', url: '#', label: 'GitHub' }
    ],
    copyright: '© 2024 Airports Portal. All rights reserved.',
    bottomLinks: [
      { text: 'Privacy Policy', url: '#' },
      { text: 'Terms of Service', url: '#' },
      { text: 'Cookie Policy', url: '#' }
    ]
  };

  constructor(public auth: AuthService) {}
  
  get userRoles(): string[] {
    return this.auth.getCurrentUser()?.roles || [];
  }

  ngOnInit() {
    // Update sidebar config with user roles
    this.sidebarConfig.userRoles = this.userRoles;
  }
}
