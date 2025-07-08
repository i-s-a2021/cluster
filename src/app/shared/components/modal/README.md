# ModalComponent

A reusable, modern, accessible modal dialog for Angular.

## Features
- Centered with backdrop
- Glassmorphism, dark mode, transitions
- Content projection (ng-content)
- Close on ESC or backdrop click
- Emits close event
- Accessible (ARIA roles, focusable)

## Usage

```
<app-modal [show]="isModalOpen" (close)="isModalOpen = false">
  <h2>Add User</h2>
  <app-user-form (submitted)="onUserAdded($event)"></app-user-form>
</app-modal>
```

- Set `[show]` to control visibility
- Listen to `(close)` to handle closing
- Project any content inside

## API
- `@Input() show: boolean` — Show/hide modal
- `@Input() ariaLabel: string` — ARIA label for accessibility
- `@Output() close: EventEmitter<void>` — Emits when modal should close

## Styling
- Fully theme-aware (glass, dark mode, transitions)
- Responsive 