import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge } from 'rxjs';
import { AuthActionsService } from '../../auth-actions/auth-service/auth-actions.service';
import { ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbbreviationService } from '../abbreviation.service';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-abbrevation-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatCardModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './abbrevation-form.component.html',
  styleUrl: './abbrevation-form.component.css'
})
export class AbbrevationFormComponent {
  readonly name = new FormControl('', [Validators.required]);

  user: any = "";
  private _snackBar = inject(MatSnackBar);
  isClicked: boolean = false;
  url: string = window.location.pathname;
  abbreviationIfUpdate: any = "";

  errorMessage = signal('');
  errorMessages: string[] = [];

  hide = signal(true);

  constructor(private authService: AuthActionsService, private cdRef: ChangeDetectorRef, private abbrevationService: AbbreviationService) {
    merge(this.name.statusChanges, this.name.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  ngOnInit(): void {
    const urlParsed = this.url.split("/");
    let id: number = parseInt(urlParsed[urlParsed.length - 1]);

    if (id) {
      this.abbrevationService.getSingleAbbreviation(id).subscribe((data) => {
        this.abbreviationIfUpdate = data;
      });
    }
  }

  updateErrorMessage() {
    if (this.name.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else {
      this.errorMessage.set('');
    }
  }

  createAbbreviation(): void {
    this.authService.getMe().subscribe((user: User) => {
      this.user = user;
    },
      (error) => {
        console.error(error);
      }
    )

    const nameValue = this.name?.value || "";
    const userIdValue = this.user.id;

    this.abbrevationService.createAbbreviation(nameValue, userIdValue).subscribe(() => {
      this.openSnackBar("Abbreviation created successfully!", "close");
      setTimeout(() => {
        location.assign("abbreviations");
      }, 1000)
    },
      (error) => {
        error.error.messages.forEach((m: string) => this.errorMessages.push(m));
        this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
      }
    )
  }

  updateAbbreviation(): void {
    const nameValue = this.name?.value || "";

    this.abbrevationService.updateAbbreviation(this.abbreviationIfUpdate.id, nameValue).subscribe(() => {
      this.openSnackBar(`Abbreviation with id ${this.abbreviationIfUpdate.id} updated successfully!`, "close");
      setTimeout(() => {
        location.assign("abbreviations");
      }, 1000)
    },
      (error) => {
        error.error.messages.forEach((m: string) => this.errorMessages.push(m));
        this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: "top"
    });
  }
}
