import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error: string | null = null;
  redirectUrl: string | null = null;
  isLoading = false;

  constructor(
    public auth: AuthService,
    public themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');
    if (this.auth.isLoggedIn()) {
      setTimeout(() => this.router.navigate([this.redirectUrl || '/dashboard']), 1000);
    }
  }

  onSubmit() {
    if (this.auth.isLoggedIn() || this.isLoading) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate([this.redirectUrl || '/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Invalid credentials. Please try again.';
      }
    });
  }
} 