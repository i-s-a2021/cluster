import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { News } from '../../../core/models/news.model';

export interface NewsCardAction {
  icon: string;
  tooltip: string;
  type: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-warning' | 'outline-danger' | 'success' | 'warning' | 'danger';
  routerLink?: string[];
  callback?: () => void;
  disabled?: boolean;
  showCondition?: boolean;
}

export interface NewsCardConfig {
  showStatus?: boolean;
  showActions?: boolean;
  showTags?: boolean;
  showMeta?: boolean;
  showFooter?: boolean;
  customClass?: string;
  maxTags?: number;
}

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss']
})
export class NewsCardComponent {
  @Input() news!: News;
  @Input() actions: NewsCardAction[] = [];
  @Input() config: NewsCardConfig = {
    showStatus: true,
    showActions: true,
    showTags: true,
    showMeta: true,
    showFooter: true,
    maxTags: 5
  };

  @Output() actionClicked = new EventEmitter<{action: string, news: News}>();
  @Output() archiveToggled = new EventEmitter<News>();
  @Output() editClicked = new EventEmitter<News>();
  @Output() viewClicked = new EventEmitter<News>();

  onActionClick(action: NewsCardAction) {
    if (action.callback) {
      action.callback();
    } else if (action.routerLink) {
      // Router will handle navigation
    } else {
      this.actionClicked.emit({ action: action.tooltip.toLowerCase().replace(/\s+/g, '_'), news: this.news });
    }
  }

  onArchiveToggle() {
    this.archiveToggled.emit(this.news);
  }

  onEditClick() {
    this.editClicked.emit(this.news);
  }

  onViewClick() {
    this.viewClicked.emit(this.news);
  }

  getVisibleTags(): string[] {
    if (!this.config.showTags || !this.news.tags) {
      return [];
    }
    return this.news.tags.slice(0, this.config.maxTags || 5);
  }

  getStatusBadgeClass(): string {
    return this.news.isArchived ? 'status-badge archived' : 'status-badge published';
  }

  getStatusIcon(): string {
    return this.news.isArchived ? 'fa-archive' : 'fa-check-circle';
  }

  getStatusText(): string {
    return this.news.isArchived ? 'NEWS.ARCHIVED' : 'NEWS.PUBLISHED';
  }
} 