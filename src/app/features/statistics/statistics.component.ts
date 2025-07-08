import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartType, ChartTypeRegistry } from 'chart.js';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { map, startWith, switchMap, filter, defaultIfEmpty } from 'rxjs/operators';

import { NewsService } from '../../core/services/news.service';
import { UserService } from '../../core/services/user.service';
import { News, NewsStatistics } from '../../core/models/news.model';
import { User } from '../../core/models/user.model';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { SearchFiltersConfig } from '../../shared/components/search-filters/search-filters.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, BaseChartDirective, ReactiveFormsModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  statistics$: Observable<NewsStatistics>;
  activeUsers$: Observable<User[]>;
  isLoading$: Observable<boolean>;
  tagChartData$: Observable<ChartData<keyof ChartTypeRegistry>>;
  chartOptions: ChartConfiguration['options'];
  monthlyChartData$: Observable<ChartData<keyof ChartTypeRegistry>>;
  lineChartOptions: ChartConfiguration['options'];
  filterForm: FormGroup;
  filteredNews$: Observable<News[]>;
  filteredUsers$: Observable<User[]>;

  // Search & Filters Configuration
  searchFiltersConfig!: SearchFiltersConfig;
  filterData: any = {};

  // Statistics cards data
  statCards = [
    {
      label: 'Total News',
      value: 0,
      icon: 'fa-newspaper',
      getValue: (stats: NewsStatistics, users: User[]) => stats?.totalNews || 0
    },
    {
      label: 'Published',
      value: 0,
      icon: 'fa-eye',
      getValue: (stats: NewsStatistics, users: User[]) => stats?.publishedNews || 0
    },
    {
      label: 'Archived',
      value: 0,
      icon: 'fa-archive',
      getValue: (stats: NewsStatistics, users: User[]) => stats?.archivedNews || 0
    },
    {
      label: 'Active Users',
      value: 0,
      icon: 'fa-users',
      getValue: (stats: NewsStatistics, users: User[]) => users?.length || 0
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
    
    const EMPTY_CHART_DATA: ChartData<keyof ChartTypeRegistry> = { labels: [], datasets: [] };
    
    this.tagChartData$ = this.filteredNews$.pipe(
      filter((news): news is News[] => !!news),
      map((news: News[]): ChartData<keyof ChartTypeRegistry> => {
        const tagCounts: { [key: string]: number } = {};
        news.forEach(item => item.tags.forEach(tag => tagCounts[tag] = (tagCounts[tag] || 0) + 1));
        return {
          labels: Object.keys(tagCounts),
          datasets: [{ 
            data: Object.values(tagCounts), 
            backgroundColor: ['#2563eb', '#818cf8', '#f59e42', '#10b981', '#f43f5e', '#fbbf24', '#a21caf'] 
          }]
        };
      }),
      startWith(EMPTY_CHART_DATA)
    );
    
    this.monthlyChartData$ = this.filteredNews$.pipe(
      filter((news): news is News[] => !!news),
      map((news: News[]): ChartData<keyof ChartTypeRegistry> => {
        const monthCounts: { [key: string]: number } = {};
        news.forEach(item => {
          const monthKey = new Date(item.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
        });
        const labels = Object.keys(monthCounts).sort();
        return {
          labels,
          datasets: [{ 
            data: labels.map(label => monthCounts[label]), 
            label: 'News Published', 
            borderColor: '#2563eb', 
            backgroundColor: 'rgba(37,99,235,0.2)', 
            fill: true 
          }]
        };
      }),
      startWith(EMPTY_CHART_DATA)
    );
    
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#374151',
            font: {
              size: 12
            }
          }
        }
      }
    };
    
    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#374151',
            font: {
              size: 12
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#6b7280'
          },
          grid: {
            color: '#e5e7eb'
          }
        },
        x: {
          ticks: {
            color: '#6b7280'
          },
          grid: {
            color: '#e5e7eb'
          }
        }
      }
    };
  }

  initializeSearchFiltersConfig() {
    this.searchFiltersConfig = {
      title: 'Statistics Filters',
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
      showActions: true
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

  ngOnInit(): void {}
} 