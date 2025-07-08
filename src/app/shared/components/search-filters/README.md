# Search & Filters Component

A reusable, configurable search and filters component that can be used across different pages in the application.

## Features

- **Configurable Fields**: Support for text, select, multiselect, date, and number input types
- **Dynamic Actions**: Customizable action buttons with different styles
- **Responsive Design**: Adapts to different screen sizes
- **Dark Mode Support**: Consistent with the application's theme
- **Modern UI**: Glassmorphism design with gradients
- **Event Communication**: Two-way communication with parent components

## Usage

### Basic Implementation

```typescript
import { SearchFiltersComponent, SearchFiltersConfig } from './shared/components/search-filters/search-filters.component';

@Component({
  // ... component configuration
  imports: [SearchFiltersComponent]
})
export class MyComponent {
  searchFiltersConfig: SearchFiltersConfig = {
    title: 'Search & Filters',
    titleIcon: 'fa-filter',
    fields: [
      {
        name: 'searchTerm',
        type: 'text',
        label: 'Search',
        placeholder: 'Search items...',
        icon: 'fa-search',
        colSize: 6
      },
      {
        name: 'category',
        type: 'select',
        label: 'Category',
        icon: 'fa-tag',
        colSize: 3,
        options: [
          { value: '', label: 'All Categories' },
          { value: 'tech', label: 'Technology' },
          { value: 'news', label: 'News' }
        ]
      }
    ],
    actions: [
      {
        label: 'Reset',
        icon: 'fa-undo',
        type: 'secondary',
        action: 'reset'
      }
    ]
  };

  onFiltersChanged(filters: any) {
    // Handle filter changes
    console.log('Filters changed:', filters);
  }

  onActionClicked(event: {action: string, data: any}) {
    // Handle action clicks
    console.log('Action clicked:', event.action, event.data);
  }
}
```

```html
<app-search-filters
  [config]="searchFiltersConfig"
  [formData]="filterData"
  [loading]="isLoading"
  (filtersChanged)="onFiltersChanged($event)"
  (actionClicked)="onActionClicked($event)">
</app-search-filters>
```

## Configuration

### SearchFiltersConfig Interface

```typescript
interface SearchFiltersConfig {
  title: string;                    // Header title
  titleIcon?: string;               // FontAwesome icon for header
  fields: FilterField[];            // Array of filter fields
  actions?: FilterAction[];         // Array of action buttons
  showReset?: boolean;              // Show default reset button
  showActions?: boolean;            // Show action buttons
  customClass?: string;             // Additional CSS classes
}
```

### FilterField Interface

```typescript
interface FilterField {
  name: string;                     // Form control name
  type: 'text' | 'select' | 'multiselect' | 'date' | 'number';
  label: string;                    // Field label
  placeholder?: string;             // Input placeholder
  icon?: string;                    // FontAwesome icon
  options?: Array<{value: string, label: string}>; // For select/multiselect
  multiple?: boolean;               // For multiselect
  required?: boolean;               // Field required
  colSize?: number;                 // Bootstrap column size (1-12)
}
```

### FilterAction Interface

```typescript
interface FilterAction {
  label: string;                    // Button text
  icon: string;                     // FontAwesome icon
  type: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary' | 'success' | 'warning' | 'danger';
  action: string;                   // Action identifier
  disabled?: boolean;               // Button disabled state
}
```

## Input Properties

- `config: SearchFiltersConfig` - Configuration object for the component
- `formData: any` - Initial form data values
- `loading: boolean` - Loading state for the component

## Output Events

- `filtersChanged: EventEmitter<any>` - Emitted when filter values change
- `actionClicked: EventEmitter<{action: string, data: any}>` - Emitted when action buttons are clicked

## Field Types

### Text Input
```typescript
{
  name: 'searchTerm',
  type: 'text',
  label: 'Search',
  placeholder: 'Search items...',
  icon: 'fa-search',
  colSize: 6
}
```

### Select Dropdown
```typescript
{
  name: 'category',
  type: 'select',
  label: 'Category',
  icon: 'fa-tag',
  colSize: 3,
  options: [
    { value: '', label: 'All Categories' },
    { value: 'tech', label: 'Technology' }
  ]
}
```

### Multi-Select
```typescript
{
  name: 'tags',
  type: 'multiselect',
  label: 'Tags',
  icon: 'fa-tags',
  colSize: 4,
  multiple: true,
  options: [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' }
  ]
}
```

### Date Input
```typescript
{
  name: 'publishDate',
  type: 'date',
  label: 'Publish Date',
  icon: 'fa-calendar',
  colSize: 3
}
```

### Number Input
```typescript
{
  name: 'price',
  type: 'number',
  label: 'Price',
  icon: 'fa-dollar-sign',
  colSize: 2
}
```

## Action Types

### Built-in Actions
- `reset` - Resets all filters to default values
- `custom` - Custom action (emits action name based on label)

### Custom Actions
```typescript
{
  label: 'Export',
  icon: 'fa-download',
  type: 'success',
  action: 'custom'
}
```

## Examples

### News List Filters
```typescript
searchFiltersConfig = {
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
  ]
};
```

### User Management Filters
```typescript
searchFiltersConfig = {
  title: 'Search & Filters',
  titleIcon: 'fa-filter',
  fields: [
    {
      name: 'searchTerm',
      type: 'text',
      label: 'Search Users',
      placeholder: 'Search by name or email...',
      icon: 'fa-search',
      colSize: 6
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      icon: 'fa-user-tag',
      colSize: 3,
      options: [
        { value: '', label: 'All Roles' },
        { value: 'admin', label: 'Admin' },
        { value: 'editor', label: 'Editor' },
        { value: 'author', label: 'Author' }
      ]
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      icon: 'fa-toggle-on',
      colSize: 3,
      options: [
        { value: '', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ],
  actions: [
    {
      label: 'Reset',
      icon: 'fa-undo',
      type: 'secondary',
      action: 'reset'
    }
  ]
};
```

## Styling

The component uses modern glassmorphism design with:
- Gradient backgrounds
- Backdrop blur effects
- Smooth transitions
- Dark mode support
- Responsive layout

All styles are scoped to the component and follow the application's design system.

## Best Practices

1. **Consistent Configuration**: Use similar field configurations across related pages
2. **Responsive Design**: Use appropriate `colSize` values for different screen sizes
3. **Clear Labels**: Provide descriptive labels and placeholders
4. **Icon Usage**: Use relevant FontAwesome icons for better UX
5. **Action Handling**: Implement proper error handling for custom actions
6. **Loading States**: Use the loading property to show loading states
7. **Form Validation**: Handle form validation in parent components 