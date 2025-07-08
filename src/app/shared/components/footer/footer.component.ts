import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslateModule } from '@ngx-translate/core';

export interface FooterBrand {
  logo: string;
  title: string;
  description: string;
}

export interface FooterLink {
  text: string;
  icon: string;
  route?: string;
  url?: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  icon: string;
  url: string;
  label: string;
}

export interface FooterBottomLink {
  text: string;
  url: string;
}

export interface FooterConfig {
  brand: FooterBrand;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  copyright: string;
  bottomLinks: FooterBottomLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @Input() config: FooterConfig = {
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
          { text: 'Users', icon: 'fas fa-users', route: '/users' }
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

  constructor(public themeService: ThemeService) {}

  // Helper method to create a minimal footer configuration
  static createMinimalConfig(): FooterConfig {
    return {
      brand: {
        logo: 'fas fa-home',
        title: 'Simple App',
        description: 'A minimal footer example'
      },
      sections: [
        {
          title: 'Navigation',
          links: [
            { text: 'Home', icon: 'fas fa-home', route: '/' },
            { text: 'About', icon: 'fas fa-info-circle', route: '/about' }
          ]
        }
      ],
      socialLinks: [],
      copyright: '© 2024 Simple App',
      bottomLinks: [
        { text: 'Privacy', url: '#' },
        { text: 'Terms', url: '#' }
      ]
    };
  }

  // Helper method to create a news-focused footer configuration
  static createNewsConfig(): FooterConfig {
    return {
      brand: {
        logo: 'fas fa-newspaper',
        title: 'News Portal',
        description: 'Stay updated with the latest news and updates'
      },
      sections: [
        {
          title: 'News Categories',
          links: [
            { text: 'Technology', icon: 'fas fa-microchip', route: '/news?category=tech' },
            { text: 'Business', icon: 'fas fa-briefcase', route: '/news?category=business' },
            { text: 'Sports', icon: 'fas fa-futbol', route: '/news?category=sports' }
          ]
        },
        {
          title: 'News Features',
          links: [
            { text: 'Latest News', icon: 'fas fa-clock', route: '/news' },
            { text: 'Popular', icon: 'fas fa-fire', route: '/news?sort=popular' },
            { text: 'Archived', icon: 'fas fa-archive', route: '/news?status=archived' }
          ]
        }
      ],
      socialLinks: [
        { icon: 'fab fa-twitter', url: '#', label: 'Follow us on Twitter' },
        { icon: 'fab fa-facebook', url: '#', label: 'Like us on Facebook' }
      ],
      copyright: '© 2024 News Portal. All rights reserved.',
      bottomLinks: [
        { text: 'Privacy Policy', url: '#' },
        { text: 'Terms of Service', url: '#' },
        { text: 'Contact', url: '#' }
      ]
    };
  }
}
