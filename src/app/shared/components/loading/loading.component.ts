import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
})
export class LoadingComponent {
  @Input() height: number = 200;
  @Input() message: string = 'Loading...';
}
