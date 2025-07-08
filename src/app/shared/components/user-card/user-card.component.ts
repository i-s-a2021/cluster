import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

export interface UserCardAction {
  icon: string;
  tooltip: string;
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'custom';
  routerLink?: any[] | string;
  callback?: () => void;
  disabled?: boolean;
}

export interface UserCardConfig {
  showAvatar?: boolean;
  showStatus?: boolean;
  showRole?: boolean;
  showMeta?: boolean;
  showActions?: boolean;
  customClass?: string;
}

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user: any;
  @Input() actions: UserCardAction[] = [];
  @Input() config: UserCardConfig = {
    showAvatar: true,
    showStatus: true,
    showRole: true,
    showMeta: true,
    showActions: true,
    customClass: ''
  };

  @Output() actionClick = new EventEmitter<{action: UserCardAction, user: any}>();

  onActionClick(action: UserCardAction, event: Event) {
    event.stopPropagation();
    if (action.callback) {
      action.callback();
    }
    this.actionClick.emit({ action, user: this.user });
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'admin': return 'admin';
      case 'editor': return 'editor';
      case 'author': return 'author';
      default: return '';
    }
  }
} 