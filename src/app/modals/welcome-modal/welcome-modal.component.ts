import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './welcome-modal.component.html',
  styleUrl: './welcome-modal.component.css'
})
export class WelcomeModalComponent {
  safeHtmlContent: SafeHtml = "";

  constructor(
    public dialogRef: MatDialogRef<WelcomeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    if (data.htmlContent) {
      this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(data.htmlContent);
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close('confirm');
  }

  onNoClick(): void {
    this.dialogRef.close('dismiss');
  }
}
