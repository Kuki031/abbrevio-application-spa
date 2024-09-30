import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthActionsService } from '../../auth-actions/auth-service/auth-actions.service';
import { User } from '../../models/user';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment-modal',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatIcon, MatSnackBarModule],
  templateUrl: './comment-modal.component.html',
  styleUrl: './comment-modal.component.css'
})
export class CommentModalComponent {
  safeHtmlContent: SafeHtml = "";
  user: any = "";
  private _snackBar = inject(MatSnackBar);


  constructor(
    public dialogRef: MatDialogRef<CommentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private authService: AuthActionsService
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
