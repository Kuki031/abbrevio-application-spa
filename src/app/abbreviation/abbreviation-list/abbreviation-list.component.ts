import { Component, inject } from '@angular/core';
import { AbbreviationService } from '../abbreviation.service';
import { Abbreviation } from '../../models/abbreviation';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { AuthActionsService } from '../../auth-actions/auth-service/auth-actions.service';
import { User } from '../../models/user';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../modals/confirm-modal/modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CreateModalComponent } from '../../modals/create-modal/create-modal.component';
import { MeaningsService } from '../../meanings/meanings.service';


@Component({
  selector: 'app-abbreviation-list',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, CommonModule, MatCardModule, MatListModule, MatTableModule, MatDialogModule, MatMenuModule, MatIconModule],
  templateUrl: './abbreviation-list.component.html',
  styleUrl: './abbreviation-list.component.css'
})


export class AbbreviationListComponent {

  abbreviationList: Abbreviation[] = [];
  searchTerm: string = "";
  hasSearched: boolean = false;
  displayedColumns: string[] = ['abbreviation', 'created_by', 'actions', 'options'];
  private _snackBar = inject(MatSnackBar);
  user: any = "";
  menuOpened: boolean = false;
  errorMessages: string[] = [];

  constructor(
    private abbreviationService: AbbreviationService,
    private authService: AuthActionsService,
    private meaningService: MeaningsService,
    public dialog: MatDialog
  ) { }

  searchAbbreviations(): void {
    if (!this.searchTerm) {
      this.openSnackBar("Empty input!", "close");
      this.hasSearched = false;
      return;
    }
    this.abbreviationService.getMatchedAbbreviations(this.searchTerm).subscribe(
      (abbreviations: Abbreviation[]) => {
        this.abbreviationList = abbreviations;

        if (!this.abbreviationList.length) {
          this.openSnackBar(`No matches for search term '${this.searchTerm}'.`, "close");
          this.hasSearched = false;
          return;
        }

        this.hasSearched = true;
      },
      (error) => {
        this.hasSearched = false;
        console.error(error);
      }
    );
  }

  listMyAbbreviations(): void {
    this.authService.getMe().subscribe((user: User) => {
      this.user = user;
    },
      (error) => {
        console.error(error);
      });

    this.abbreviationService.getMyAbbreviations().subscribe((abbreviations: Abbreviation[]) => {
      this.abbreviationList = abbreviations;

      if (!this.abbreviationList.length) {
        this.openSnackBar("You haven't created any abbreviations.", "close");
        this.hasSearched = false;
        return;
      }
      this.hasSearched = true;
    },
      (error) => {
        this.hasSearched = false;
        console.error(error);
      }
    );
  }

  deleteAbbreviation(id: number, name: string): void {
    this.abbreviationService.deleteAbbreviation(id).subscribe(() => {
      this.abbreviationList = this.abbreviationList.filter(abbreviation => abbreviation.id !== id);
      this.openSnackBar(`Successfully deleted abbreviation "${name}".`, "close");
    },
      (error) => {
        this.openSnackBar(error.error.message, "close");
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: "top"
    });
  }

  openDialogDelete(id: number, name: string, event: MouseEvent): void {
    event.preventDefault();

    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: `Delete abbreviation "${name}"?`,
        closeText: 'Dismiss',
        confirmText: 'Confirm'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') this.deleteAbbreviation(id, name);
    });
  }

  openDialogCreateMeaning(id: number, name: string, event: MouseEvent): void {
    event.preventDefault();

    const dialogRef = this.dialog.open(CreateModalComponent, {
      data: {
        title: `Create meaning for abbreviation "${name}"?`,
        closeText: 'Dismiss',
        confirmText: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== 'dismiss') {
        this.meaningService.createMeaningForAbbreviation(result, id).subscribe(() => {
          this.openSnackBar("Meaning for abbreviation created successfully!", "close");
        },
          (error) => {
            error.error.messages.forEach((m: string) => this.errorMessages.push(m));
            this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
          }
        )
      }
    });
  }

  onMenuFocus(): void {
    this.menuOpened = true;
  }

  onMenuBlur(): void {
    this.menuOpened = false;
  }
}
