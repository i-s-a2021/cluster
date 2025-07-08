import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../core/models/user.model';
import { Observable, of } from 'rxjs';
import { map, debounceTime, switchMap, first } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';

function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  if (!value) return null;
  const hasNumber = /[0-9]/.test(value);
  const hasLetter = /[a-zA-Z]/.test(value);
  return value.length >= 8 && hasNumber && hasLetter ? null : { strongPassword: true };
}

function uniqueEmailValidator(userService: UserService, currentUserId?: string): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const email = control.value;
    if (!email) return of(null);
    return userService.getAll().pipe(
      debounceTime(300),
      map(users => {
        const found = users.find(u => u.email === email && u.id !== currentUserId);
        return found ? { uniqueEmail: true } : null;
      }),
      first()
    );
  };
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() availableRoles$: Observable<string[]> = new Observable();
  @Output() submitUser = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  imagePreview: string | null = null;
  loading = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [uniqueEmailValidator(this.userService)],
        updateOn: 'blur'
      }],
      password: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator]],
      roles: [[], Validators.required],
      image: ['']
    });
  }

  ngOnInit() {
    if (this.user) {
      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        roles: this.user.roles,
        image: this.user.image || ''
      });
      this.imagePreview = this.user.image || null;
      if (this.mode === 'edit') {
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        // Set unique email validator to ignore current user
        this.userForm.get('email')?.setAsyncValidators([uniqueEmailValidator(this.userService, this.user.id)]);
      }
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.userForm.patchValue({ image: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    this.submitUser.emit(this.userForm.value);
  }
} 