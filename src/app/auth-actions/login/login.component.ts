import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { AuthActionsService } from '../auth-service/auth-actions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly username = new FormControl('', [Validators.required]);
  readonly password = new FormControl('', [Validators.required]);

  errorMessage = signal('');

  hide = signal(true);

  constructor(private authService: AuthActionsService) {
    merge(this.username.statusChanges, this.username.valueChanges, this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.username.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.username.hasError('username')) {
      this.errorMessage.set('Not a valid username');
    } else if (this.password.hasError('required')) {
      this.errorMessage.set('Password is required');
    } else {
      this.errorMessage.set('');
    }
  }

  login(): void {
    const usernameValue = this.username.value || '';
    const passwordValue = this.password.value || '';

    if (!this.username.valid || !this.password.valid) {
      console.error('Form is invalid');
      return;
    }

    this.authService.login(usernameValue, passwordValue).subscribe(
      (user) => console.log('Login successful', user),
      (error) => console.error('Login failed', error)
    );
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
