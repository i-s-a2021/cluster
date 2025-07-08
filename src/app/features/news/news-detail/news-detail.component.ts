import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { NewsService } from '../../../core/services/news.service';
import { News } from '../../../core/models/news.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  news$: Observable<News | undefined>;
  isLoading$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {
    this.isLoading$ = this.newsService.isLoading();
    
    this.news$ = this.route.params.pipe(
      switchMap(params => this.newsService.getById(params['id']))
    );
  }

  ngOnInit() {}

  toggleArchive(news: News): void {
    if (news.isArchived) {
      this.newsService.unarchive(news.id).subscribe();
    } else {
      this.newsService.archive(news.id).subscribe();
    }
  }

  shareArticle(news: News): void {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.summary,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  }

  printArticle(): void {
    window.print();
  }
}
