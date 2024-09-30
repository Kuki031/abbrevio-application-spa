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
import { Vote } from '../../models/vote';
import { CommentListComponent } from '../../comment/comment-list/comment-list.component';
import { WelcomeModalComponent } from '../../modals/welcome-modal/welcome-modal.component';
import { CommentService } from '../../comment/comment.service';
import { Comment } from '../../models/comment';
import { CommentModalComponent } from '../../modals/comment-modal/comment-modal.component';


@Component({
  selector: 'app-meanings-list',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, CommonModule, MatCardModule, MatListModule, MatTableModule, MatDialogModule, MatMenuModule, MatIconModule],
  templateUrl: './meanings-list.component.html',
  styleUrl: './meanings-list.component.css'
})
export class MeaningsListComponent {

  meanings: Meaning[] = [];
  displayedColumns: string[] = ['votes', 'description', 'created_by', 'actions', 'like'];
  private _snackBar = inject(MatSnackBar);
  errorMessages: string[] = [];
  user: any = "";
  abbreviation: any = "";
  vote: any = "";
  comments: Comment[] = [];

  constructor(private meaningService: MeaningsService, private abbreviationService: AbbreviationService, public dialog: MatDialog, private authService: AuthActionsService, private commentService: CommentService) { }
  ngOnInit(): void {

    this.authService.getMe().subscribe((user: User) => {
      this.user = user;
    })

    const url = window.location.pathname;
    const ids = url.match(/(\d+)/);

    if (ids) {
      const abbrevId = ids[0];

      this.abbreviationService.getSingleAbbreviation(parseInt(abbrevId)).subscribe((data) => {
        this.abbreviation = data;

      },
        (error) => {
          error.error.messages.forEach((m: string) => this.errorMessages.push(m));
          this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
        }
      )

      this.meaningService.getAllMeaningsForAbbreviation(parseInt(abbrevId)).subscribe((data: Meaning[]) => {
        this.meanings = data;
        this.meanings.forEach(mean => {
          this.meaningService.getVoteForMeaning(mean.id).subscribe((vote: Vote) => {

            if (vote && vote.userId === this.user.id) {
              mean.isLiked = true;
            } else { mean.isLiked = false }
          },
            (error) => {
              console.error(error);
            }
          )
        })

        if (this.meanings.some(mean => mean.user && mean.user.id === this.user.id)) {
          if (!this.displayedColumns.find(val => val === "options")) {
            this.displayedColumns.push('options');
          }
        }
        else if (!this.meanings.some(mean => mean.user && mean.user.id === this.user.id) && this.displayedColumns.find(val => val === "options")) {
          const index = this.displayedColumns.findIndex(val => val === "options");
          this.displayedColumns.splice(index, 1);
        }
      },
        (error) => {
          error.error.messages.forEach((m: string) => this.errorMessages.push(m));
          this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
        }
      )
    }
  }

  castVoteForMeaning(meaningId: number) {
    this.meaningService.voteForMeaning(meaningId).subscribe(() => {
      location.reload();

    },
      (error) => {
        error.error.messages.forEach((m: string) => this.errorMessages.push(m));
        this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
      }
    )
  }

  castUnVoteForMeaning(meaningId: number) {
    this.meaningService.unVoteForMeaning(meaningId).subscribe(() => {
      location.reload();
    },
      (error) => {
        error.error.messages.forEach((m: string) => this.errorMessages.push(m));
        this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
      }
    )
  }

  deleteMeaning(abbrevId: number, meaningId: number, name: string): void {
    this.meaningService.deleteMeaningForAbbreviation(abbrevId, meaningId).subscribe(() => {
      this.meanings = this.meanings.filter(meaning => meaning.id !== meaningId);
      this.openSnackBar(`Successfully deleted meaning "${name}".`, "close");
    },
      (error) => {
        this.openSnackBar(error.error.message, "close");
      }
    );
  }

  openDialogDelete(abbrevId: number, meaningId: number, name: string, event: Event): void {
    event.preventDefault();

    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: `Delete meaning "${name}"?`,
        closeText: 'Dismiss',
        confirmText: 'Confirm'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') this.deleteMeaning(abbrevId, meaningId, name);
    });
  }

  openDialogComments(meaningId: number, event: Event): void {
    event.preventDefault();

    this.commentService.getAllCommentsForMeaning(meaningId).subscribe((comments: Comment[]) => {
      this.comments = comments;
      this.comments.forEach(comment => comment.isEditing = false);

      const dialogRef = this.dialog.open(CommentModalComponent, {
        data: {
          title: "Comments",
          closeText: 'Dismiss',
          confirmText: 'Confirm',
          content: this.comments,
          meaning: meaningId
        }
      });

      dialogRef.componentInstance.commentUpdated.subscribe(() => {
        dialogRef.close();
      });

      dialogRef.componentInstance.commentDeleted.subscribe(() => {
        this.commentService.getAllCommentsForMeaning(meaningId).subscribe((comments: Comment[]) => {
          this.comments = comments;
          this.comments.forEach(comment => comment.isEditing = false);
        })
        dialogRef.close();
      })
      dialogRef.afterClosed().subscribe(result => {

      });
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: "top"
    });
  }

}
