# Dashboard News Card Component

A reusable, lightweight news card component specifically designed for dashboard displays with simplified styling and compact layout.

## Features

- **Compact Design**: Optimized for dashboard layouts with smaller footprint
- **Configurable Tags**: Show/hide tags with customizable maximum count
- **Simplified Actions**: No action buttons, focused on display and navigation
- **Responsive Design**: Adapts to different screen sizes
- **Event Communication**: Emits click events to parent components
- **Clean Styling**: Bootstrap card-based design with hover effects

## Usage

### Basic Implementation

```typescript
import { DashboardNewsCardComponent, DashboardNewsCardConfig } from './shared/components/dashboard-news-card/dashboard-news-card.component';

@Component({
  // ... component configuration
  imports: [DashboardNewsCardComponent]
})
export class MyComponent {
  dashboardNewsCardConfig: DashboardNewsCardConfig = {
    showTags: true,
    maxTags: 2,
    customClass: ''
  };

  onNewsCardClicked(news: News) {
    console.log('News card clicked:', news);
  }
}
```

```html
<app-dashboard-news-card
  [news]="newsItem"
  [config]="dashboardNewsCardConfig"
  (newsClicked)="onNewsCardClicked($event)">
</app-dashboard-news-card>
```

## Configuration

### DashboardNewsCardConfig Interface

```typescript
interface DashboardNewsCardConfig {
  showTags?: boolean;        // Show tags section
  maxTags?: number;          // Maximum number of tags to display
  customClass?: string;      // Additional CSS classes
}
```

## Input Properties

- `news: News` - The news article data
- `config: DashboardNewsCardConfig` - Configuration object for display options

## Output Events

- `newsClicked: EventEmitter<News>` - Emitted when the news card is clicked

## Styling

The component uses Bootstrap card design with:
- Clean white background
- Subtle shadows and borders
- Hover effects with lift animation
- Responsive typography
- Dark mode support

### Default Configuration

```typescript
{
  showTags: true,
  maxTags: 2,
  customClass: ''
}
```

## Examples

### Dashboard Recent News
```typescript
dashboardNewsCardConfig: DashboardNewsCardConfig = {
  showTags: true,
  maxTags: 2,
  customClass: ''
};
```

### Compact News List
```typescript
dashboardNewsCardConfig: DashboardNewsCardConfig = {
  showTags: false,
  maxTags: 0,
  customClass: 'compact-news'
};
```

### Custom Styling
```scss
.compact-news {
  .card-body {
    padding: 0.75rem;
  }
  
  .card-title a {
    font-size: 0.9rem;
  }
  
  .card-text {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
}
```

## Differences from Main News Card

| Feature | Dashboard News Card | Main News Card |
|---------|-------------------|----------------|
| Actions | No action buttons | Full action buttons |
| Status | No status badges | Status badges |
| Footer | No footer | View button footer |
| Tags | Limited display | Full tag display |
| Size | Compact | Full-size |
| Purpose | Dashboard display | News management |

## Best Practices

1. **Use for Dashboards**: Perfect for dashboard widgets and recent news displays
2. **Limit Tags**: Keep maxTags low (1-2) for compact display
3. **Event Handling**: Implement click handlers for navigation
4. **Responsive Design**: Test on different screen sizes
5. **Performance**: Lightweight component for better performance
6. **Consistency**: Use consistent configuration across dashboard sections

## Integration

The component works seamlessly with the News model:

```typescript
import { News } from '../../core/models/news.model';

// The component expects News objects with:
// - id: string
// - title: string
// - summary: string
// - author: string
// - publishDate: Date
// - tags: string[]
// - isArchived: boolean
// - content: string (optional)
// - createdAt: Date (optional)
// - updatedAt: Date (optional)
``` 