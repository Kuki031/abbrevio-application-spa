import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { AuthActionsService } from '../auth-service/auth-actions.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class RegisterComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly username = new FormControl('', [Validators.required]);
  readonly password = new FormControl('', [Validators.required]);
  readonly passwordConfirm = new FormControl('', [Validators.required]);
  isClicked: boolean = false;
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  errorMessage = signal('');

  errorMessages: string[] = [];

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(private authService: AuthActionsService, private cdRef: ChangeDetectorRef) {
    merge(this.username.statusChanges, this.username.valueChanges, this.password.statusChanges, this.password.valueChanges, this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  register(event: Event): void {
    event.preventDefault();

    const usernameValue = this.username.value || '';
    const emailValue = this.email.value || '';
    const passwordValue = this.password.value || '';
    const passwordConfirmValue = this.passwordConfirm.value || '';

    if (passwordValue !== passwordConfirmValue) {
      this.errorMessages.push('Passwords do not match');
      return;
    }

    this.isClicked = true;
    this.cdRef.detectChanges();

    this.authService.register(usernameValue, emailValue, passwordValue).subscribe(
      () => {
        this.openSnackBar("Registration successful! You may now log in.", "close");
        setTimeout(() => {
          this.router.navigate(['/home']);
          this.isClicked = false;
          this.cdRef.detectChanges();
        }, 1000);

      },
      (error) => {
        this.isClicked = false;
        this.cdRef.detectChanges();
        error.error.messages.forEach((m: string) => this.errorMessages.push(m));
        if (this.errorMessages.length) {
          this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
        }
      }
    );
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: "top"
    });
  }
}
