import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthActionsService } from '../../auth-actions/auth-service/auth-actions.service';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatDialogModule, MatCardModule, MatMenuModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthActionsService, public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(Modal, {
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }



  isLoggedIn: boolean = false;
  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem("Bearer");
  }

  logOut(): void {
    this.authService.logout();
    location.assign("/home");
  }

}
@Component({
  selector: 'modal',
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  standalone: true,
  imports: [MatCardModule, MatButtonModule]
})
export class Modal {

  constructor(
    public dialogRef: MatDialogRef<Modal>,
    @Inject(MAT_DIALOG_DATA) public data: "hi") { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
