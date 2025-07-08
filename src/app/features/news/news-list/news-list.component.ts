import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import { NewsService } from '../../../core/services/news.service';
import { News, NewsFilter } from '../../../core/models/news.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { AuthService } from '../../../core/services/auth.service';
import { SearchFiltersComponent, SearchFiltersConfig, FilterField, FilterAction } from '../../../shared/components/search-filters/search-filters.component';
import { NewsCardComponent, NewsCardAction, NewsCardConfig } from '../../../shared/components/news-card/news-card.component';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingComponent, SearchFiltersComponent, NewsCardComponent, TranslateModule],
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  showArchived = false;
  filterForm: FormGroup;
  availableTags$: Observable<string[]>;
  isLoading$: Observable<boolean>;
  filteredNews$: Observable<News[]>;
  
  // Toast notification properties
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'info';
  toastTimeout: any;
  
  // Search & Filters Configuration
  searchFiltersConfig!: SearchFiltersConfig;
  filterData: any = {};

  // News Card Configuration
  newsCardConfig: NewsCardConfig = {
    showStatus: true,
    showActions: true,
    showTags: true,
    showMeta: true,
    showFooter: true,
    maxTags: 5
  };

  constructor(
    private fb: FormBuilder, 
    private newsService: NewsService,
    public auth: AuthService
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      tags: [[]],
      status: ['']
    });
    this.availableTags$ = this.newsService.getAvailableTags();
    this.isLoading$ = this.newsService.isLoading$;
    
    this.initializeSearchFiltersConfig();
    
    this.filteredNews$ = this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      switchMap(formValue => this.newsService.getFilteredNews({
        ...formValue,
        isArchived: this.showArchived ? true : undefined,
        status: formValue.status || undefined
      }))
    );
  }

  ngOnInit(): void {}

  initializeSearchFiltersConfig() {
    this.searchFiltersConfig = {
      title: 'Search & Filters',
      titleIcon: 'fa-filter',
      fields: [
        {
          name: 'searchTerm',
          type: 'text',
          label: 'Search',
          placeholder: 'Search news articles...',
          icon: 'fa-search',
          colSize: 4
        },
        {
          name: 'tags',
          type: 'multiselect',
          label: 'Tags',
          icon: 'fa-tags',
          colSize: 3,
          multiple: true,
          options: []
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          icon: 'fa-filter',
          colSize: 2,
          options: [
            { value: '', label: 'All' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' }
          ]
        }
      ],
      actions: [
        {
          label: 'Reset',
          icon: 'fa-undo',
          type: 'secondary',
          action: 'reset'
        },
        {
          label: 'Toggle Archived',
          icon: 'fa-archive',
          type: 'outline-primary',
          action: 'custom'
        }
      ],
      showReset: true,
      showActions: true
    };

    // Update tags options when available
    this.availableTags$.subscribe(tags => {
      const tagsField = this.searchFiltersConfig.fields.find(f => f.name === 'tags');
      if (tagsField) {
        tagsField.options = tags.map(tag => ({ value: tag, label: tag }));
      }
    });
  }

  getNewsCardActions(news: News): NewsCardAction[] {
    const actions: NewsCardAction[] = [];
    
    if (this.auth.isLoggedIn() && this.auth.hasAnyRole(['admin','editor'])) {
      actions.push({
        icon: 'fa-edit',
        tooltip: 'Edit',
        type: 'outline-secondary',
        routerLink: ['/news', news.id, 'edit']
      });
      
      actions.push({
        icon: news.isArchived ? 'fa-box-open' : 'fa-archive',
        tooltip: news.isArchived ? 'Restore' : 'Archive',
        type: news.isArchived ? 'outline-success' : 'outline-warning',
        callback: () => this.toggleArchive(news)
      });
    }
    
    return actions;
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
      case 'toggle_archived':
        this.toggleArchived();
        break;
    }
  }

  onNewsCardActionClicked(event: {action: string, news: News}) {
    console.log('News card action clicked:', event.action, event.news);
  }

  onNewsCardArchiveToggled(news: News) {
    this.toggleArchive(news);
  }

  onNewsCardEditClicked(news: News) {
    // Handle edit action
    console.log('Edit news:', news);
  }

  onNewsCardViewClicked(news: News) {
    // Handle view action
    console.log('View news:', news);
  }

  resetFilters() {
    this.filterForm.reset({ searchTerm: '', tags: [], status: '' });
    this.filterForm.updateValueAndValidity();
  }

  toggleArchived() {
    this.showArchived = !this.showArchived;
    this.filterForm.updateValueAndValidity();
  }

  toggleArchive(news: News) {
    if (news.isArchived) {
      // Restore news
      this.newsService.unarchive(news.id).subscribe({
        next: (updatedNews) => {
          if (updatedNews) {
            this.showToast(`"${news.title}" has been restored successfully.`, 'success');
            // Refresh the filtered news list
            this.filterForm.updateValueAndValidity();
          }
        },
        error: (error) => {
          console.error('Error restoring news:', error);
          this.showToast(`Failed to restore "${news.title}". Please try again.`, 'error');
        }
      });
    } else {
      // Archive news
      this.newsService.archive(news.id).subscribe({
        next: (updatedNews) => {
          if (updatedNews) {
            this.showToast(`"${news.title}" has been archived successfully.`, 'success');
            // Refresh the filtered news list
            this.filterForm.updateValueAndValidity();
          }
        },
        error: (error) => {
          console.error('Error archiving news:', error);
          this.showToast(`Failed to archive "${news.title}". Please try again.`, 'error');
        }
      });
    }
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    
    // Clear existing timeout
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    
    // Auto-hide toast after 3 seconds
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
