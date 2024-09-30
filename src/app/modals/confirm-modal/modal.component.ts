import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [MatCardModule, MatButtonModule, CommonModule]
})
export class ModalComponent {

  safeHtmlContent: SafeHtml = "";

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
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