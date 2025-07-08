import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';

import { NewsService } from '../../../core/services/news.service';
import { News } from '../../../core/models/news.model';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './news-form.component.html',
})
export class NewsFormComponent implements OnInit {
  isLoading$: Observable<boolean> = new Observable();
  isEditMode = false;
  newsForm: FormGroup;
  availableTags$: Observable<string[]> = new Observable();
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required],
      publishDate: ['', Validators.required],
      tagsInput: [''],
      isArchived: [false]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.isLoading$ = this.newsService.isLoading$;
        this.newsService.getById(id).subscribe(news => {
          if (news) {
            this.newsForm.patchValue({
              title: news.title,
              summary: news.summary,
              content: news.content,
              author: news.author,
              publishDate: this.formatDate(news.publishDate),
              tagsInput: news.tags.join(', '),
              isArchived: news.isArchived
            });
          } else {
            this.router.navigate(['/news']);
          }
        });
      } else {
        this.isEditMode = false;
      }
    });
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }

  onSubmit() {
    this.isSubmitting = true;
    const formValue = this.newsForm.value;
    const newsData: Partial<News> = {
      title: formValue.title,
      summary: formValue.summary,
      content: formValue.content,
      author: formValue.author,
      publishDate: new Date(formValue.publishDate),
      tags: formValue.tagsInput.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
      isArchived: formValue.isArchived
    };

    if (this.isEditMode) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.newsService.update(id, newsData).subscribe(() => {
            this.isSubmitting = false;
            this.router.navigate(['/news']);
          });
        }
      });
    } else {
      const createData = {
        title: formValue.title || '',
        summary: formValue.summary || '',
        content: formValue.content || '',
        author: formValue.author || '',
        publishDate: new Date(formValue.publishDate),
        tags: formValue.tagsInput.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
        isArchived: formValue.isArchived
      };
      this.newsService.create(createData).subscribe(() => {
        this.isSubmitting = false;
        this.router.navigate(['/news']);
      });
    }
  }

  addTag(tag: string) {
    // Implement add tag logic
  }
}
