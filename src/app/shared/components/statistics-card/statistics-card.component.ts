import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface StatisticsCardConfig {
  showIcon?: boolean;
  iconSize?: string;
  customClass?: string;
  showAnimation?: boolean;
}

export interface StatisticsCardData {
  label: string;
  value: number | string;
  icon: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

@Component({
  selector: 'app-statistics-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './statistics-card.component.html',
  styleUrls: ['./statistics-card.component.scss']
})
export class StatisticsCardComponent {
  @Input() data!: StatisticsCardData;
  @Input() config: StatisticsCardConfig = {
    showIcon: true,
    iconSize: 'fa-2x',
    customClass: '',
    showAnimation: true
  };

  @Output() cardClicked = new EventEmitter<StatisticsCardData>();

  onCardClick() {
    this.cardClicked.emit(this.data);
  }

  getIconClass(): string {
    return `fas ${this.data.icon} ${this.config.iconSize}`;
  }

  getCardClass(): string {
    let classes = 'stat-card';
    if (this.config.customClass) {
      classes += ` ${this.config.customClass}`;
    }
    if (this.config.showAnimation) {
      classes += ' animate-on-hover';
    }
    return classes;
  }

  getTranslatedLabel(): string {
    const labelMap: { [key: string]: string } = {
      'Total News': 'STATISTICS.TOTAL_NEWS',
      'Published': 'STATISTICS.PUBLISHED',
      'Archived': 'STATISTICS.ARCHIVED',
      'Active Users': 'STATISTICS.ACTIVE_USERS',
      'Total Users': 'STATISTICS.TOTAL_USERS',
      'Today Visits': 'STATISTICS.TODAY_VISITS'
    };
    return labelMap[this.data.label] || this.data.label;
  }
} 