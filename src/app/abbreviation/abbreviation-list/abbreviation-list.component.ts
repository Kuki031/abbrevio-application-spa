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
import { Meaning } from '../../models/meaning';
import { forkJoin, map } from 'rxjs';


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
  displayedColumns: string[] = ['abbreviation', 'created_by', 'actions', 'print'];
  private _snackBar = inject(MatSnackBar);
  user: any = "";
  menuOpened: boolean = false;
  errorMessages: string[] = [];
  selectedItems: Abbreviation[] = [];
  selectedCount: number = 0;

  constructor(
    private abbreviationService: AbbreviationService,
    private authService: AuthActionsService,
    private meaningService: MeaningsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.authService.getMe().subscribe((user: User) => {
      this.user = user;
    },
      (error) => {
        this.openSnackBar("Something went wrong!", "close");
      });
  }

  searchAbbreviations(): void {
    if (!this.searchTerm) {
      this.openSnackBar("Empty input!", "close");
      this.hasSearched = false;
      return;
    }

    this.abbreviationService.getMatchedAbbreviations(this.searchTerm).subscribe(
      (abbreviations: Abbreviation[]) => {
        this.abbreviationList = abbreviations;
        if (this.abbreviationList.some(abbr => abbr.user && abbr.user.id === this.user.id)) {
          if (!this.displayedColumns.find(val => val === "options")) {
            this.displayedColumns.push('options');
          }
        } else if (!this.abbreviationList.some(abbr => abbr.user && abbr.user.id === this.user.id) && this.displayedColumns.find(val => val === "options")) {
          const index = this.displayedColumns.findIndex(val => val === "options");
          this.displayedColumns.splice(index, 1);
        }
        if (!this.abbreviationList.length) {
          this.openSnackBar(`No matches for search term '${this.searchTerm}'.`, "close");
          this.hasSearched = false;
          this.searchTerm = "";
          return;
        }
        this.hasSearched = true;
        this.searchTerm = "";
      },
      (error) => {
        this.hasSearched = false;
        this.searchTerm = "";
        this.openSnackBar("Something went wrong!", "close");
      }
    );
  }

  listMyAbbreviations(): void {
    this.abbreviationService.getMyAbbreviations().subscribe((abbreviations: Abbreviation[]) => {
      this.abbreviationList = abbreviations;

      if (!this.abbreviationList.length) {
        this.openSnackBar("You haven't created any abbreviations.", "close");
        this.hasSearched = false;
        return;
      }
      if (this.abbreviationList.some(abbr => abbr.user && abbr.user.id === this.user.id)) {
        if (!this.displayedColumns.find(val => val === "options")) {
          this.displayedColumns.push('options');
        }
      }
      else if (!this.abbreviationList.some(abbr => abbr.user && abbr.user.id === this.user.id) && this.displayedColumns.find(val => val === "options")) {
        const index = this.displayedColumns.findIndex(val => val === "options");
        this.displayedColumns.splice(index, 1);
      }
      this.hasSearched = true;
    },
      (error) => {
        this.hasSearched = false;
        this.openSnackBar("Something went wrong!", "close");
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

  onCheckboxChange(event: Event, abbs: Abbreviation): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedItems.push(abbs);
      this.selectedCount++;
    } else {
      this.selectedItems = this.selectedItems.filter(item => item.id !== abbs.id);
      this.selectedCount--;
    }
  }

  printSelectedItems(): void {
    const meaningRequests = this.selectedItems.map(item =>
      this.meaningService.getAllMeaningsForAbbreviation(item.id).pipe(
        map((data: Meaning[]) => {
          item.meanings = data;
          return {
            name: item.name,
            createdBy: item.user?.username || 'No info',
            meanings: data.map(meaning => meaning.description).join(', ')
          };
        })
      )
    );

    forkJoin(meaningRequests).subscribe((results) => {
      const printContents = results.map(item => `
        <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
          <strong>Abbreviation:</strong> ${item.name} <br>
          <strong>Created by:</strong> ${item.createdBy} <br>
          <strong>Meanings:</strong> ${item.meanings || 'No meanings available.'}
        </div>
      `).join('');

      const width = 800;
      const height = 600;

      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);

      const printWindow = window.open('', '', `width=${width},height=${height},left=${left},top=${top}`);
      printWindow?.document.write(`
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                line-height: 1.6;
              }
              h2 {
                text-align: center;
              }
            </style>
          </head>
          <body>
            <h2>Selected Abbreviations</h2>
            ${printContents}
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
    });
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
