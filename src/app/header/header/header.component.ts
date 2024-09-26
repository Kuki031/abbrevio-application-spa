import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthActionsService } from '../../auth-actions/auth-service/auth-actions.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { ModalComponent } from '../../modals/confirm-modal/modal.component';
import { WelcomeModalComponent } from '../../modals/welcome-modal/welcome-modal.component';


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
    const dialogRef = this.dialog.open(WelcomeModalComponent, {
      data: {
        title: 'Welcome to Abbrevio Lookup application!',
        content: ['The Abbreviation Lookup Application allows employees to quickly search for the meanings of abbreviations.', 'Users can vote or comment on existing explanations, helping to highlight the most useful ones.', ' In addition, users can create new entries for abbreviations not yet listed in the app.'],
        closeText: 'Dismiss'
      }
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
