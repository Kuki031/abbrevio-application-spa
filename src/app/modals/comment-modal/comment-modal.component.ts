import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthActionsService } from '../../auth-actions/auth-service/auth-actions.service';
import { User } from '../../models/user';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalComponent } from '../confirm-modal/modal.component';
import { CommentService } from '../../comment/comment.service';
import { Comment } from '../../models/comment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-modal',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatIcon, MatSnackBarModule, FormsModule],
  templateUrl: './comment-modal.component.html',
  styleUrl: './comment-modal.component.css'
})
export class CommentModalComponent {

  @Output() commentUpdated = new EventEmitter<void>();
  @Output() commentDeleted = new EventEmitter<void>();
  @Output() commentCreated = new EventEmitter<void>();

  safeHtmlContent: SafeHtml = "";
  user: any = "";
  private _snackBar = inject(MatSnackBar);
  errorMessages: string[] = [];
  comments: any[] = [];
  editCommentId: number | null = null;
  isEditing: boolean = false;
  newCommentContent: string = '';
  isAddingComment: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CommentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private authService: AuthActionsService,
    private dialog: MatDialog,
    private commentService: CommentService
  ) {

    if (data.htmlContent) {
      this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(data.htmlContent);
    }
  }

  ngOnInit(): void {
    this.authService.getMe().subscribe((user: User) => {
      this.user = user;
    })
  }

  openDialogDelete(meaningId: number, commentId: number, event: Event): void {
    event.preventDefault();

    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: `Delete comment?`,
        closeText: 'Dismiss',
        confirmText: 'Confirm'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.deleteComment(meaningId, commentId);
      }
    });
  }

  deleteComment(meaningId: number, commentId: number): void {
    this.commentService.deleteComment(meaningId, commentId).subscribe(() => {
      this.dialogRef.close();
      this.openSnackBar('Comment deleted successfully!', 'close');
    },
      (error) => {
        error.error.messages.forEach((m: string) => this.errorMessages.push(m));
        this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
      }
    )
  }

  createComment(meaningId: number): void {
    if (this.newCommentContent.trim() === '') {
      this.openSnackBar('Comment cannot be empty!', 'close');
      return;
    }

    this.commentService.createComment(meaningId, this.newCommentContent).subscribe(() => {
      this.openSnackBar('Comment added successfully!', 'close');
      this.newCommentContent = '';
      this.isAddingComment = false;
      this.dialogRef.close();

    }, (error) => {
      error.error.messages.forEach((m: string) => this.errorMessages.push(m));
      this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
    });
  }

  updateComment(meaningId: number, commentId: number, updatedContent: string, item: any): void {

    item.isEditing = true;
    const updatedComment = { content: updatedContent };
    this.commentService.updateComment(meaningId, commentId, updatedComment.content).subscribe(() => {
      this.openSnackBar('Comment updated successfully!', 'close');
      this.dialogRef.close();
      item.isEditing = false;

    }, (error) => {
      item.isEditing = false;
      error.error.messages.forEach((m: string) => this.errorMessages.push(m));
      this.errorMessages.forEach((m: string) => this.openSnackBar(m, 'close'));
    });
  }

  onConfirmClick(): void {
    this.dialogRef.close('confirm');
  }

  onNoClick(): void {
    this.dialogRef.close('dismiss');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: "top"
    });
  }
}
