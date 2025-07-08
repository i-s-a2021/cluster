export interface News {
  id: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  publishDate: Date;
  author: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsFilter {
  searchTerm?: string;
  tags?: string[];
  isArchived?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface NewsStatistics {
  totalNews: number;
  publishedNews: number;
  archivedNews: number;
  newsPerMonth: { [key: string]: number };
  newsPerTag: { [key: string]: number };
}
