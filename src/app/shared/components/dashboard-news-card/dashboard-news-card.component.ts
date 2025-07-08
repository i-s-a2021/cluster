import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { News } from '../../../core/models/news.model';

export interface DashboardNewsCardConfig {
  showTags?: boolean;
  maxTags?: number;
  customClass?: string;
}

@Component({
  selector: 'app-dashboard-news-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './dashboard-news-card.component.html',
  styleUrls: ['./dashboard-news-card.component.scss']
})
export class DashboardNewsCardComponent {
  @Input() news!: News;
  @Input() config: DashboardNewsCardConfig = {
    showTags: true,
    maxTags: 2,
    customClass: ''
  };

  @Output() newsClicked = new EventEmitter<News>();

  onNewsClick() {
    this.newsClicked.emit(this.news);
  }

  getVisibleTags(): string[] {
    if (!this.config.showTags || !this.news.tags) {
      return [];
    }
    return this.news.tags.slice(0, this.config.maxTags || 2);
  }
} 