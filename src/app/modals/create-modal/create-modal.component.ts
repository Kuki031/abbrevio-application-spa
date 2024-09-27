import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-modal',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.css']
})
export class CreateModalComponent {
  safeHtmlContent: SafeHtml = "";
  inputValue: string = "";
  static predefinedInputValue = "";

  constructor(
    public dialogRef: MatDialogRef<CreateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    if (data.htmlContent) {
      this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(data.htmlContent);
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(this.inputValue);
  }

  onNoClick(): void {
    this.dialogRef.close('dismiss');
  }
}
