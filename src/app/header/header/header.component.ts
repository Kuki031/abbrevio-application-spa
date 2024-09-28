import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthActionsService } from '../../auth-actions/auth-service/auth-actions.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { WelcomeModalComponent } from '../../modals/welcome-modal/welcome-modal.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatDialogModule, MatCardModule, MatMenuModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isMobileView: boolean = false;
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
    });
  }

  isLoggedIn: boolean = false;
  ngOnInit(): void {
    this.checkScreenSize();
    this.isLoggedIn = !!localStorage.getItem("Bearer");
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 450;
  }

  logOut(): void {
    this.authService.logout();
    location.assign("/home");
  }
}
