import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface FilterField {
  name: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'number';
  label: string;
  placeholder?: string;
  icon?: string;
  options?: Array<{value: string, label: string}>;
  multiple?: boolean;
  required?: boolean;
  colSize?: number; // Bootstrap column size (1-12)
}

export interface FilterAction {
  label: string;
  icon: string;
  type: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary' | 'success' | 'warning' | 'danger';
  action: string; // 'reset' | 'custom' | 'toggle'
  disabled?: boolean;
}

export interface SearchFiltersConfig {
  title: string;
  titleIcon?: string;
  fields: FilterField[];
  actions?: FilterAction[];
  showReset?: boolean;
  showActions?: boolean;
  customClass?: string;
}

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit {
  @Input() config: SearchFiltersConfig = {
    title: 'Search & Filters',
    titleIcon: 'fa-filter',
    fields: [],
    actions: [],
    showReset: true,
    showActions: true
  };

  @Input() formData: any = {};
  @Input() loading: boolean = false;

  @Output() filtersChanged = new EventEmitter<any>();
  @Output() actionClicked = new EventEmitter<{action: string, data: any}>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit() {
    this.buildForm();
    this.filterForm.valueChanges.subscribe(value => {
      this.filtersChanged.emit(value);
    });
  }

  buildForm() {
    const formGroup: any = {};
    
    this.config.fields.forEach(field => {
      const defaultValue = this.formData[field.name] || (field.multiple ? [] : '');
      formGroup[field.name] = [defaultValue];
    });

    this.filterForm = this.fb.group(formGroup);
  }

  onActionClick(action: FilterAction) {
    switch (action.action) {
      case 'reset':
        this.resetFilters();
        break;
      case 'custom':
        this.actionClicked.emit({ action: action.label.toLowerCase().replace(/\s+/g, '_'), data: this.filterForm.value });
        break;
      default:
        this.actionClicked.emit({ action: action.action, data: this.filterForm.value });
        break;
    }
  }

  resetFilters() {
    this.filterForm.reset();
    this.filtersChanged.emit(this.filterForm.value);
  }

  getFieldColClass(field: FilterField): string {
    return field.colSize ? `col-md-${field.colSize}` : 'col-md-3';
  }

  getFieldType(field: FilterField): string {
    switch (field.type) {
      case 'text':
      case 'number':
        return 'text';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  }

  getFieldClass(field: FilterField): string {
    return field.type === 'select' || field.type === 'multiselect' ? 'form-select' : 'form-control';
  }
} 