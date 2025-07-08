import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { map, startWith, switchMap } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import { NewsService } from '../../core/services/news.service';
import { UserService } from '../../core/services/user.service';
import { News, NewsStatistics } from '../../core/models/news.model';
import { User } from '../../core/models/user.model';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { SearchFiltersComponent, SearchFiltersConfig } from '../../shared/components/search-filters/search-filters.component';
import { DashboardNewsCardComponent, DashboardNewsCardConfig } from '../../shared/components/dashboard-news-card/dashboard-news-card.component';
import { StatisticsCardComponent, StatisticsCardConfig, StatisticsCardData } from '../../shared/components/statistics-card/statistics-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, ReactiveFormsModule, SearchFiltersComponent, DashboardNewsCardComponent, StatisticsCardComponent, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistics$: Observable<NewsStatistics>;
  activeUsers$: Observable<User[]>;
  isLoading$: Observable<boolean>;
  recentNews$: Observable<News[]>;
  filterForm: FormGroup;
  filteredNews$: Observable<News[]>;
  filteredUsers$: Observable<User[]>;

  // Search & Filters Configuration
  searchFiltersConfig!: SearchFiltersConfig;
  filterData: any = {};

  // Dashboard News Card Configuration
  dashboardNewsCardConfig: DashboardNewsCardConfig = {
    showTags: true,
    maxTags: 2,
    customClass: ''
  };

  // Statistics Card Configuration
  statisticsCardConfig: StatisticsCardConfig = {
    showIcon: true,
    iconSize: 'fa-2x',
    customClass: '',
    showAnimation: true
  };

  // Statistics cards data
  statCards: StatisticsCardData[] = [
    {
      label: 'Total News',
      value: 0,
      icon: 'fa-newspaper'
    },
    {
      label: 'Published',
      value: 0,
      icon: 'fa-eye'
    },
    {
      label: 'Archived',
      value: 0,
      icon: 'fa-archive'
    },
    {
      label: 'Active Users',
      value: 0,
      icon: 'fa-users'
    }
  ];

  constructor(
    private newsService: NewsService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      tag: [''],
      userSearch: ['']
    });

    this.initializeSearchFiltersConfig();
    
    this.filteredNews$ = this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      switchMap(formValue => this.newsService.getFilteredNews({
        searchTerm: formValue.searchTerm,
        tags: formValue.tag ? [formValue.tag] : []
      })),
      map(news => news ?? [])
    );
    
    this.filteredUsers$ = this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      switchMap(formValue => this.userService.getFiltered({
        searchTerm: formValue.userSearch
      }))
    );
    
    this.statistics$ = this.filteredNews$.pipe(
      map(news => {
        const totalNews = news.length;
        const publishedNews = news.filter(n => !n.isArchived).length;
        const archivedNews = news.filter(n => n.isArchived).length;
        const newsPerMonth: { [key: string]: number } = {};
        const newsPerTag: { [key: string]: number } = {};
        
        news.forEach(item => {
          const monthKey = new Date(item.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          newsPerMonth[monthKey] = (newsPerMonth[monthKey] || 0) + 1;
          item.tags.forEach(tag => {
            newsPerTag[tag] = (newsPerTag[tag] || 0) + 1;
          });
        });
        
        return { totalNews, publishedNews, archivedNews, newsPerMonth, newsPerTag };
      })
    );
    
    this.activeUsers$ = this.filteredUsers$.pipe(
      map(users => users.filter(u => u.isActive))
    );
    
    this.isLoading$ = this.newsService.isLoading$;
    
    this.recentNews$ = this.filteredNews$.pipe(
      map(news => news.filter(n => !n.isArchived).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 5))
    );
  }

  initializeSearchFiltersConfig() {
    this.searchFiltersConfig = {
      title: 'Dashboard Filters',
      titleIcon: 'fa-filter',
      fields: [
        {
          name: 'searchTerm',
          type: 'text',
          label: 'Search News',
          placeholder: 'Search news...',
          icon: 'fa-search',
          colSize: 4
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Tag',
          placeholder: 'Tag (optional)',
          icon: 'fa-tag',
          colSize: 3
        },
        {
          name: 'userSearch',
          type: 'text',
          label: 'Search Users',
          placeholder: 'Search users...',
          icon: 'fa-user',
          colSize: 4
        }
      ],
      actions: [
        {
          label: 'Reset',
          icon: 'fa-undo',
          type: 'secondary',
          action: 'reset'
        }
      ],
      showReset: true,
      showActions: true,
      customClass: 'dashboard-filters'
    };
  }

  onFiltersChanged(filters: any) {
    this.filterData = filters;
    this.filterForm.patchValue(filters);
  }

  onActionClicked(event: {action: string, data: any}) {
    switch (event.action) {
      case 'reset':
        this.resetFilters();
        break;
    }
  }

  resetFilters() {
    this.filterForm.reset({ searchTerm: '', tag: '', userSearch: '' });
    this.filterForm.updateValueAndValidity();
  }

  onNewsCardClicked(news: News) {
    // Handle news card click
    console.log('News card clicked:', news);
  }

  onStatisticsCardClicked(cardData: StatisticsCardData) {
    // Handle statistics card click
    console.log('Statistics card clicked:', cardData);
  }

  ngOnInit(): void {
    // Update statistics cards with live data
    this.statistics$.subscribe(stats => {
      if (stats) {
        this.statCards[0].value = stats.totalNews;
        this.statCards[1].value = stats.publishedNews;
        this.statCards[2].value = stats.archivedNews;
      }
    });

    this.activeUsers$.subscribe(users => {
      if (users) {
        this.statCards[3].value = users.length;
      }
    });
  }
}
