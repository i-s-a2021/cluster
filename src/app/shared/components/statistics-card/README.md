# Statistics Card Component

A reusable, modern statistics card component with gradient backgrounds, hover effects, and configurable display options.

## Features

- **Gradient Backgrounds**: Beautiful gradient designs with hover animations
- **Configurable Icons**: FontAwesome icons with customizable sizes
- **Responsive Design**: Adapts to different screen sizes
- **Event Communication**: Emits click events to parent components
- **Dark Mode Support**: Automatic theme adaptation
- **Animation Options**: Configurable hover animations

## Usage

### Basic Implementation

```typescript
import { StatisticsCardComponent, StatisticsCardConfig, StatisticsCardData } from './shared/components/statistics-card/statistics-card.component';

@Component({
  // ... component configuration
  imports: [StatisticsCardComponent]
})
export class MyComponent {
  statisticsCardConfig: StatisticsCardConfig = {
    showIcon: true,
    iconSize: 'fa-2x',
    customClass: '',
    showAnimation: true
  };

  statCardData: StatisticsCardData = {
    label: 'Total Users',
    value: 1250,
    icon: 'fa-users',
    color: '#667eea'
  };

  onStatisticsCardClicked(cardData: StatisticsCardData) {
    console.log('Statistics card clicked:', cardData);
  }
}
```

```html
<app-statistics-card
  [data]="statCardData"
  [config]="statisticsCardConfig"
  (cardClicked)="onStatisticsCardClicked($event)">
</app-statistics-card>
```

## Configuration

### StatisticsCardConfig Interface

```typescript
interface StatisticsCardConfig {
  showIcon?: boolean;        // Show/hide the icon
  iconSize?: string;         // FontAwesome icon size class
  customClass?: string;      // Additional CSS classes
  showAnimation?: boolean;   // Enable/disable hover animations
}
```

### StatisticsCardData Interface

```typescript
interface StatisticsCardData {
  label: string;                    // Card label/title
  value: number | string;           // Display value
  icon: string;                     // FontAwesome icon class
  color?: string;                   // Custom color (optional)
  trend?: 'up' | 'down' | 'neutral'; // Trend indicator (optional)
  trendValue?: number;              // Trend value (optional)
}
```

## Input Properties

- `data: StatisticsCardData` - The statistics data to display
- `config: StatisticsCardConfig` - Configuration object for display options

## Output Events

- `cardClicked: EventEmitter<StatisticsCardData>` - Emitted when the card is clicked

## Styling

The component features:
- **Gradient Backgrounds**: Purple-blue gradient by default
- **Hover Effects**: Lift animation with enhanced shadows
- **Responsive Typography**: Adaptive font sizes
- **Dark Mode**: Automatic theme switching
- **Smooth Transitions**: CSS transitions for all interactions

### Default Configuration

```typescript
{
  showIcon: true,
  iconSize: 'fa-2x',
  customClass: '',
  showAnimation: true
}
```

## Examples

### Dashboard Statistics
```typescript
statisticsCardConfig: StatisticsCardConfig = {
  showIcon: true,
  iconSize: 'fa-2x',
  customClass: '',
  showAnimation: true
};

statCards: StatisticsCardData[] = [
  {
    label: 'Total News',
    value: 150,
    icon: 'fa-newspaper'
  },
  {
    label: 'Published',
    value: 120,
    icon: 'fa-eye'
  },
  {
    label: 'Archived',
    value: 30,
    icon: 'fa-archive'
  },
  {
    label: 'Active Users',
    value: 45,
    icon: 'fa-users'
  }
];
```

### Custom Styling
```scss
.custom-stat-card {
  .stat-card {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    
    &:hover {
      background: linear-gradient(135deg, #ff5252 0%, #e53e3e 100%);
    }
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 800;
  }
  
  .stat-label {
    font-size: 1rem;
    font-weight: 600;
  }
}
```

### Compact Cards
```typescript
compactConfig: StatisticsCardConfig = {
  showIcon: true,
  iconSize: 'fa-lg',
  customClass: 'compact-card',
  showAnimation: false
};
```

## Best Practices

1. **Consistent Icons**: Use FontAwesome icons consistently across cards
2. **Meaningful Labels**: Keep labels short and descriptive
3. **Responsive Values**: Format large numbers appropriately
4. **Color Coordination**: Use consistent color schemes
5. **Performance**: Limit the number of animated cards
6. **Accessibility**: Ensure sufficient color contrast

## Integration

The component works with any data structure that matches the `StatisticsCardData` interface:

```typescript
// Example integration with dashboard data
this.statistics$.subscribe(stats => {
  this.statCards[0].value = stats.totalNews;
  this.statCards[1].value = stats.publishedNews;
  this.statCards[2].value = stats.archivedNews;
});

this.activeUsers$.subscribe(users => {
  this.statCards[3].value = users.length;
});
```

## Responsive Behavior

- **Desktop**: Full-size cards with large icons
- **Tablet**: Slightly reduced padding and font sizes
- **Mobile**: Compact layout with smaller icons and text

## Dark Mode Support

The component automatically adapts to dark mode:
- Lighter gradient backgrounds
- Enhanced shadow effects
- Improved contrast ratios
- Consistent hover states 