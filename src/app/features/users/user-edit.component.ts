import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { UserFormComponent } from './user-form.component';
import { Observable, of, switchMap } from 'rxjs';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {
  user$: Observable<User | null>;
  availableRoles$: Observable<string[]>;
  toastMessage: string | null = null;
  toastTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.availableRoles$ = this.userService.getAvailableRoles();
    this.user$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) return of(null);
        return this.userService.getAll().pipe(
          switchMap(users => of(users.find(u => u.id === id) || null))
        );
      })
    );
  }

  onSubmit(formValue: any, user: User) {
    const updatedUser = { ...user, ...formValue, updatedAt: new Date() };
    this.userService.update(user.id, updatedUser).subscribe({
      next: () => {
        this.showToast('User updated successfully!');
        setTimeout(() => this.router.navigate(['../../'], { relativeTo: this.route }), 1200);
      },
      error: () => {
        this.showToast('Failed to update user.', true);
      }
    });
  }

  onCancel() {
    this.router.navigate(['../../'], { relativeTo: this.route });
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