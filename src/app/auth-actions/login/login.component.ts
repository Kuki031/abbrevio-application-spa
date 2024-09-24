import { ChangeDetectionStrategy, Component, inject, Injectable, signal } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, CommonModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class LoginComponent {
  readonly username = new FormControl('', [Validators.required]);
  readonly password = new FormControl('', [Validators.required]);

  private _snackBar = inject(MatSnackBar);
  isClicked: boolean = false;

  errorMessage = signal('');
  errorMessages: string[] = [];

  hide = signal(true);

  constructor(private authService: AuthActionsService, private cdRef: ChangeDetectorRef) {
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

  login(e: MouseEvent): void {
    const buttonEl = e.target as HTMLButtonElement;
    const usernameValue = this.username?.value || '';
    const passwordValue = this.password?.value || '';

    this.isClicked = true;
    this.cdRef.detectChanges();

    this.authService.login(usernameValue, passwordValue).subscribe(
      (user) => {
        localStorage.setItem(user.tokenType, user.accessToken);

        if (user) {
          setTimeout(() => {
            location.assign('home');
            this.isClicked = false;
            this.cdRef.detectChanges();
          }, 2000);
        }
      },
      (error) => {
        this.isClicked = false;
        this.cdRef.detectChanges();
        error.error.messages.forEach((m: string) => this.errorMessages.push(m));
        this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: "top"
    });
  }

  clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
