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

@Component({
  selector: 'app-abbreviation-list',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, CommonModule, MatCardModule, MatListModule, MatTableModule],
  templateUrl: './abbreviation-list.component.html',
  styleUrl: './abbreviation-list.component.css'
})


export class AbbreviationListComponent {

  abbreviationList: Abbreviation[] = [];
  constructor(private abbreviationService: AbbreviationService) { }
  searchTerm: string = "";
  hasSearched: boolean = false;
  displayedColumns: string[] = ['id', 'abbreviation', 'created_by', 'actions'];
  private _snackBar = inject(MatSnackBar);

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


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: "top"
    });
  }
}
