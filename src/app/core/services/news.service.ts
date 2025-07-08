import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { News, NewsFilter, NewsStatistics } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends BaseService<News> {
  
  protected getInitialData(): News[] {
    return [
      {
        id: '1',
        title: 'New Terminal Expansion Project Announced',
        content: 'Cluster2 Airports is excited to announce the launch of our new terminal expansion project. This ambitious initiative will add 50,000 square feet of new retail and dining space, along with enhanced passenger amenities. The project is expected to begin construction in Q2 2025 and be completed by Q4 2026. The expansion will feature state-of-the-art technology, sustainable design elements, and improved accessibility features. We anticipate this will significantly enhance the passenger experience and increase our capacity to serve more travelers efficiently.',
        summary: 'Major terminal expansion project will add 50,000 sq ft of new facilities, starting Q2 2025.',
        tags: ['infrastructure', 'expansion', 'development'],
        publishDate: new Date('2025-01-15'),
        author: 'Sarah Johnson',
        isArchived: false,
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-15')
      },
      {
        id: '2',
        title: 'Sustainability Initiative: 100% Renewable Energy',
        content: 'We are proud to announce that all Cluster2 Airports facilities will be powered by 100% renewable energy by the end of 2025. This initiative includes the installation of solar panels, wind turbines, and energy-efficient systems throughout our facilities. The project represents a $50 million investment in sustainable infrastructure and will reduce our carbon footprint by 80%. We have partnered with leading renewable energy providers to ensure reliable, clean power for all our operations. This achievement positions us as a leader in sustainable aviation infrastructure.',
        summary: 'All facilities will run on 100% renewable energy by end of 2025, reducing carbon footprint by 80%. ',
        tags: ['sustainability', 'renewable-energy', 'environment'],
        publishDate: new Date('2025-01-12'),
        author: 'Michael Chen',
        isArchived: false,
        createdAt: new Date('2025-01-12'),
        updatedAt: new Date('2025-01-12')
      },
      {
        id: '3',
        title: 'Digital Transformation: New Mobile App Launch',
        content: 'Experience seamless travel with our new mobile application, now available on iOS and Android. The app features real-time flight tracking, mobile check-in, digital boarding passes, and interactive terminal maps. Passengers can also access exclusive offers, book parking spots, and receive personalized travel notifications. The app includes augmented reality features to help navigate our facilities and provides multilingual support in 12 languages. Download now and enjoy a 20% discount on your first parking reservation.',
        summary: 'New mobile app offers comprehensive travel services with AR navigation and exclusive benefits.',
        tags: ['technology', 'mobile', 'digital-services'],
        publishDate: new Date('2025-01-10'),
        author: 'Lisa Rodriguez',
        isArchived: false,
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-10')
      },
      {
        id: '4',
        title: 'Safety First: Enhanced Security Measures',
        content: 'Following the latest international security standards, we have implemented advanced biometric screening systems and AI-powered threat detection technology. These upgrades ensure faster processing times while maintaining the highest security standards. Our staff has completed comprehensive training on the new systems, and passenger wait times have been reduced by 30%. The new technology includes facial recognition, advanced X-ray screening, and automated threat detection algorithms. We continue to prioritize passenger safety while improving the overall travel experience.',
        summary: 'Advanced biometric and AI security systems reduce wait times by 30% while enhancing safety.',
        tags: ['security', 'technology', 'safety'],
        publishDate: new Date('2025-01-08'),
        author: 'David Kim',
        isArchived: false,
        createdAt: new Date('2025-01-08'),
        updatedAt: new Date('2025-01-08')
      },
      {
        id: '5',
        title: 'Community Partnership: Local Art Installation',
        content: 'We are delighted to showcase works from local artists in our new community art installation program. The program features rotating exhibitions in Terminal A, highlighting regional talent and cultural diversity. This month, we are featuring contemporary sculptures and paintings from 15 local artists, creating an inspiring environment for travelers. The installation includes interactive digital displays with artist biographies and cultural context. We believe art enhances the travel experience and strengthens our connection to the local community.',
        summary: 'New community art program features rotating exhibitions from 15 local artists in Terminal A.',
        tags: ['community', 'art', 'culture'],
        publishDate: new Date('2025-01-05'),
        author: 'Emma Thompson',
        isArchived: false,
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-05')
      },
      {
        id: '6',
        title: 'Q4 2024 Performance Review',
        content: 'Our Q4 2024 performance exceeded expectations with record passenger numbers and operational efficiency. We served 2.3 million passengers, a 15% increase from the previous year. On-time performance reached 94%, and customer satisfaction scores averaged 4.8/5. These achievements reflect our commitment to excellence and continuous improvement. The quarter also saw the successful completion of several infrastructure projects and the launch of new sustainability initiatives.',
        summary: 'Q4 2024 delivered record performance with 2.3M passengers and 94% on-time rate.',
        tags: ['performance', 'statistics', 'achievements'],
        publishDate: new Date('2024-12-28'),
        author: 'Robert Wilson',
        isArchived: true,
        createdAt: new Date('2024-12-28'),
        updatedAt: new Date('2024-12-28')
      }
    ];
  }

  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getFiltered(filter: NewsFilter): Observable<News[]> {
    return this.getAll().pipe(
      map(news => {
        let filtered = news;

        if (filter.searchTerm) {
          const searchLower = filter.searchTerm.toLowerCase();
          filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(searchLower) ||
            item.content.toLowerCase().includes(searchLower) ||
            item.summary.toLowerCase().includes(searchLower)
          );
        }

        if (filter.tags && filter.tags.length > 0) {
          filtered = filtered.filter(item => 
            filter.tags!.some(tag => item.tags.includes(tag))
          );
        }

        if (filter.isArchived !== undefined) {
          filtered = filtered.filter(item => item.isArchived === filter.isArchived);
        }

        if (filter.dateFrom) {
          filtered = filtered.filter(item => 
            item.publishDate >= filter.dateFrom!
          );
        }

        if (filter.dateTo) {
          filtered = filtered.filter(item => 
            item.publishDate <= filter.dateTo!
          );
        }

        return filtered.sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
      })
    );
  }

  getStatistics(): Observable<NewsStatistics> {
    return this.getAll().pipe(
      map(news => {
        const totalNews = news.length;
        const publishedNews = news.filter(n => !n.isArchived).length;
        const archivedNews = news.filter(n => n.isArchived).length;

        const newsPerMonth: { [key: string]: number } = {};
        const newsPerTag: { [key: string]: number } = {};

        news.forEach(item => {
          const monthKey = new Date(item.publishDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
          });
          newsPerMonth[monthKey] = (newsPerMonth[monthKey] || 0) + 1;

          item.tags.forEach(tag => {
            newsPerTag[tag] = (newsPerTag[tag] || 0) + 1;
          });
        });

        return {
          totalNews,
          publishedNews,
          archivedNews,
          newsPerMonth,
          newsPerTag
        };
      })
    );
  }

  archive(id: string): Observable<News | null> {
    return this.update(id, { isArchived: true });
  }

  unarchive(id: string): Observable<News | null> {
    return this.update(id, { isArchived: false });
  }

  getAllTags(): Observable<string[]> {
    return this.getAll().pipe(
      map(news => {
        const tagSet = new Set<string>();
        news.forEach(item => {
          item.tags.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
      })
    );
  }

  // Observable for loading state
  get isLoading$(): Observable<boolean> {
    return this.isLoading();
  }

  // Get available tags as observable
  getAvailableTags(): Observable<string[]> {
    return this.getAllTags();
  }

  // Get filtered news (for NewsListComponent)
  getFilteredNews(filter: any): Observable<News[]> {
    return this.getFiltered(filter);
  }

  // Get recent news (for DashboardComponent)
  getRecentNews(): Observable<News[]> {
    return this.getAll().pipe(
      map(news => news
        .filter(n => !n.isArchived)
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, 5)
      )
    );
  }
}
