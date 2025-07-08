import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

import { UserService } from '../../core/services/user.service';
import { User, UserFilter } from '../../core/models/user.model';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { UserCardComponent, UserCardAction, UserCardConfig } from '../../shared/components/user-card/user-card.component';
import { SearchFiltersComponent, SearchFiltersConfig, FilterField, FilterAction } from '../../shared/components/search-filters/search-filters.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingComponent, UserCardComponent, SearchFiltersComponent, TranslateModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  filterForm: FormGroup;
  isLoading$: Observable<boolean> = new Observable();
  filteredUsers$: Observable<User[]> = new Observable();
  allUsers$: Observable<User[]> = new Observable();
  activeUsersCount$: Observable<number>;
  adminCount$: Observable<number>;
  inactiveCount$: Observable<number>;
  toastMessage: string = '';
  toastTimeout: any;
  toastType: string = '';
  lastDeletedUser: User | null = null;

  // Search & Filters Configuration
  searchFiltersConfig!: SearchFiltersConfig;
  filterData: any = {};

  userCardConfig: UserCardConfig = {
    showAvatar: true,
    showStatus: true,
    showRole: true,
    showMeta: true,
    showActions: true,
    customClass: ''
  };

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      role: [''],
      status: ['']
    });
    this.isLoading$ = this.userService.isLoading$;
    
    this.initializeSearchFiltersConfig();
    
    this.filteredUsers$ = this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      switchMap(formValue => this.userService.getFiltered({
        ...formValue,
        isActive: formValue.status === 'active' ? true : formValue.status === 'inactive' ? false : undefined
      }))
    );
    this.allUsers$ = this.userService.getAll();
    this.activeUsersCount$ = this.filteredUsers$.pipe(map(users => users.filter(u => u.isActive).length));
    this.adminCount$ = this.filteredUsers$.pipe(map(users => users.filter(u => u.roles.includes('admin')).length));
    this.inactiveCount$ = this.filteredUsers$.pipe(map(users => users.filter(u => !u.isActive).length));
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
    this.filterForm.reset({ searchTerm: '', role: '', status: '' });
    this.filterForm.updateValueAndValidity();
  }

  getUserCardActions(user: User): UserCardAction[] {
    return [
      {
        icon: 'fa-eye',
        tooltip: 'View Profile',
        type: 'secondary',
        disabled: true
      },
      {
        icon: 'fa-edit',
        tooltip: 'Edit User',
        type: 'primary',
        routerLink: ['./', user.id, 'edit']
      },
      {
        icon: user.isActive ? 'fa-user-times' : 'fa-user-check',
        tooltip: user.isActive ? 'Deactivate User' : 'Activate User',
        type: user.isActive ? 'warning' : 'success',
        callback: () => this.toggleUserStatus(user)
      },
      {
        icon: 'fa-trash',
        tooltip: 'Delete User',
        type: 'danger',
        callback: () => this.deleteUser(user)
      }
    ];
  }

  toggleUserStatus(user: User) {
    this.userService.toggleUserStatus(user.id).subscribe(
      () => {
        this.toastMessage = `User '${user.name}' has been ${user.isActive ? 'activated' : 'deactivated'} successfully.`;
        this.toastType = 'success';
        if (this.toastTimeout) {
          clearTimeout(this.toastTimeout);
        }
        this.toastTimeout = setTimeout(() => {
          this.toastMessage = '';
        }, 3000);
      },
      (error) => {
        this.toastMessage = `Failed to ${user.isActive ? 'activate' : 'deactivate'} user '${user.name}'. Please try again later.`;
        this.toastType = 'error';
        if (this.toastTimeout) {
          clearTimeout(this.toastTimeout);
        }
        this.toastTimeout = setTimeout(() => {
          this.toastMessage = '';
        }, 3000);
      }
    );
  }

  deleteUser(user: User) {
    if (window.confirm(`Are you sure you want to delete user '${user.name}'? This action cannot be undone.`)) {
      this.userService.deleteUser(user.id).subscribe(
        () => {
          this.toastMessage = `User '${user.name}' has been deleted successfully.`;
          this.toastType = 'success';
          this.lastDeletedUser = user;
          if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
          }
          this.toastTimeout = setTimeout(() => {
            this.toastMessage = '';
          }, 3000);
        },
        (error) => {
          this.toastMessage = `Failed to delete user '${user.name}'. Please try again later.`;
          this.toastType = 'error';
          if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
          }
          this.toastTimeout = setTimeout(() => {
            this.toastMessage = '';
          }, 3000);
        }
      );
    }
  }

  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

  undoDeleteUser() {
    if (this.lastDeletedUser) {
      const user = this.lastDeletedUser;
      this.userService.restoreUser(user);
      this.showToast(`User '${user.name}' has been restored.`, 'undo');
      this.lastDeletedUser = null;
    }
  }
}
