import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserFormComponent } from './user-form.component';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, UserFormComponent, TranslateModule],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent {
  availableRoles$: Observable<string[]>;
  toastMessage: string | null = null;
  toastTimeout: any;
  constructor(private userService: UserService, private router: Router) {
    this.availableRoles$ = this.userService.getAvailableRoles();
  }

  onSubmit(formValue: any) {
    this.userService.createUser(formValue).subscribe({
      next: () => {
        this.showToast('User added successfully!');
        setTimeout(() => this.router.navigate(['../']), 1200);
      },
      error: () => {
        this.showToast('Failed to add user.', true);
      }
    });
  }

  onCancel() {
    this.router.navigate(['../']);
  }

  showToast(message: string, error = false) {
    this.toastMessage = message;
    if (error) {
      this.toastMessage += '';
    }
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
    }, 2000);
  }
} 