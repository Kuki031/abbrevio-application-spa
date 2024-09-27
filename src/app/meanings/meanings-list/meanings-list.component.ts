import { Component } from '@angular/core';
import { Meaning } from '../../models/meaning';
import { inject } from '@angular/core';
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
import { AbbreviationService } from '../../abbreviation/abbreviation.service';


@Component({
  selector: 'app-meanings-list',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, CommonModule, MatCardModule, MatListModule, MatTableModule, MatDialogModule, MatMenuModule, MatIconModule],
  templateUrl: './meanings-list.component.html',
  styleUrl: './meanings-list.component.css'
})
export class MeaningsListComponent {

  meanings: Meaning[] = [];
  displayedColumns: string[] = ['description', 'created_by', 'actions', 'options'];
  private _snackBar = inject(MatSnackBar);
  errorMessages: string[] = [];

  abbreviation: any = "";

  constructor(private meaningService: MeaningsService, private abbreviationService: AbbreviationService, public dialog: MatDialog) { }
  ngOnInit(): void {

    const url = window.location.pathname;
    const id = url.match(/(\d+)/);

    if (id) {
      const abbrevId = id[0];

      this.abbreviationService.getSingleAbbreviation(parseInt(abbrevId)).subscribe((data) => {
        this.abbreviation = data;
      },
        (error) => {
          error.error.messages.forEach((m: string) => this.errorMessages.push(m));
          this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
        }
      )

      this.meaningService.getAllMeaningsForAbbreviation(parseInt(abbrevId)).subscribe((data: Meaning[]) => {
        console.log(data);

        this.meanings = data;
      },
        (error) => {
          error.error.messages.forEach((m: string) => this.errorMessages.push(m));
          this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
        }
      )
    }
  }

  deleteMeaning(abbrevId: number, meaningId: number): void {
    this.meaningService.deleteMeaningForAbbreviation(abbrevId, meaningId).subscribe(() => {
      this.meanings = this.meanings.filter(meaning => meaning.id !== meaningId);
      this.openSnackBar(`Successfully deleted abbreviation with ID ${meaningId}.`, "close");
    },
      (error) => {
        this.openSnackBar(error.error.message, "close");
      }
    );
  }

  openDialogDelete(abbrevId: number, meaningId: number, event: MouseEvent): void {
    event.preventDefault();

    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: `Delete meaning with ID ${meaningId}?`,
        closeText: 'Dismiss',
        confirmText: 'Confirm'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') this.deleteMeaning(abbrevId, meaningId);
    });
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: "top"
    });
  }

}
