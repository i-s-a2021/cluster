import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, User } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

export interface SidebarItem {
  label: string;
  icon?: string;
  route?: string;
  children?: SidebarItem[];
  permission?: string | string[];
  badge?: string;
  badgeColor?: string;
}

export interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
  permission?: string | string[];
  collapsed?: boolean;
}

export interface SidebarConfig {
  items: SidebarItem[];
  groups?: SidebarGroup[];
  userRoles: string[];
  collapsed?: boolean;
  showToggle?: boolean;
  showBadges?: boolean;
  expandOnHover?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() config: SidebarConfig = {
    items: [
      { label: 'Dashboard', icon: 'fa-tachometer-alt', route: '/dashboard' },
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

  // Legacy support for backward compatibility
  @Input() items: SidebarItem[] = [];
  @Input() collapsed = false;
  @Input() userRoles: string[] = [];

  activeRoute: string = '';
  expandedGroups: Set<string> = new Set();
  private userSub?: Subscription;

  constructor(private router: Router, public themeService: ThemeService, private authService: AuthService) {
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  ngOnInit() {
    this.activeRoute = this.router.url;
    // Subscribe to user changes
    this.userSub = this.authService.currentUser$.subscribe((user: User | null) => {
      const roles = user?.roles || [];
      this.config.userRoles = roles;
      this.userRoles = roles; // for legacy support
    });
    // Legacy support: if items are provided via @Input, use them
    if (this.items.length > 0) {
      this.config.items = this.items;
    }
    if (this.userRoles.length > 0) {
      this.config.userRoles = this.userRoles;
    }
    if (this.collapsed !== undefined) {
      this.config.collapsed = this.collapsed;
    }
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  hasPermission(item: SidebarItem | SidebarGroup): boolean {
    if (!item.permission) return true;
    
    const roles = this.config.userRoles;
    if (Array.isArray(item.permission)) {
      return item.permission.some(role => roles.includes(role));
    }
    return roles.includes(item.permission);
  }

  toggleCollapse() {
    this.config.collapsed = !this.config.collapsed;
  }

  onGroupClick(item: SidebarItem) {
    if (item.children) {
      if (this.expandedGroups.has(item.label)) {
        this.expandedGroups.delete(item.label);
      } else {
        this.expandedGroups.add(item.label);
      }
    }
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  isGroupActive(item: SidebarItem): boolean {
    if (item.route && this.activeRoute === item.route) return true;
    if (item.children) {
      return item.children.some(child => child.route && this.activeRoute.startsWith(child.route));
    }
    return false;
  }

  // Helper method to create a minimal sidebar configuration
  static createMinimalConfig(): SidebarConfig {
    return {
      items: [
        { label: 'Home', icon: 'fa-home', route: '/' },
        { label: 'About', icon: 'fa-info-circle', route: '/about' }
      ],
      userRoles: [],
      collapsed: false,
      showToggle: true,
      showBadges: false,
      expandOnHover: false,
      theme: 'auto'
    };
  }

  // Helper method to create a news-focused sidebar configuration
  static createNewsConfig(): SidebarConfig {
    return {
      items: [
        { label: 'Latest News', icon: 'fa-clock', route: '/news' },
        { label: 'Categories', icon: 'fa-tags', route: '/news/categories' },
        { label: 'Popular', icon: 'fa-fire', route: '/news/popular' },
        { label: 'Archived', icon: 'fa-archive', route: '/news/archived', permission: ['admin','editor'] }
      ],
      userRoles: [],
      collapsed: false,
      showToggle: true,
      showBadges: true,
      expandOnHover: false,
      theme: 'auto'
    };
  }

  // Helper method to create an admin-focused sidebar configuration
  static createAdminConfig(): SidebarConfig {
    return {
      items: [
        { label: 'Dashboard', icon: 'fa-tachometer-alt', route: '/dashboard' },
        { label: 'Users', icon: 'fa-users', route: '/users', permission: ['admin'], children: [
          { label: 'All Users', icon: 'fa-users', route: '/users', permission: ['admin'] },
          { label: 'Add User', icon: 'fa-user-plus', route: '/users/add', permission: ['admin'] },
          { label: 'Roles', icon: 'fa-user-tag', route: '/users/roles', permission: ['admin'] }
        ]},
        { label: 'Content', icon: 'fa-newspaper', route: '/content', permission: ['admin','editor'], children: [
          { label: 'News', icon: 'fa-newspaper', route: '/news', permission: ['admin','editor','author'] },
          { label: 'Categories', icon: 'fa-tags', route: '/news/categories', permission: ['admin','editor'] },
          { label: 'Media', icon: 'fa-images', route: '/media', permission: ['admin','editor'] }
        ]},
        { label: 'Analytics', icon: 'fa-chart-bar', route: '/analytics', permission: ['admin'], children: [
          { label: 'Statistics', icon: 'fa-chart-line', route: '/statistics', permission: ['admin','editor'] },
          { label: 'Reports', icon: 'fa-file-alt', route: '/reports', permission: ['admin'] }
        ]},
        { label: 'Settings', icon: 'fa-cog', route: '/settings', permission: ['admin'] }
      ],
      userRoles: [],
      collapsed: false,
      showToggle: true,
      showBadges: true,
      expandOnHover: true,
      theme: 'auto'
    };
  }
} 