import { Component, inject } from '@angular/core';
import { AuthActionsService } from '../auth-service/auth-actions.service';
import { User } from '../../models/user';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatSnackBarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {


  user: any = "";
  private _snackbar = inject(MatSnackBar);

  constructor(private authService: AuthActionsService) { }

  ngOnInit(): void {
    this.authService.getMe().subscribe((data: User) => {
      this.user = data;
    },
      (error) => {
        this.openSnackBar("Something went wrong!", "close");
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackbar.open(message, action, {
      duration: 2000,
      verticalPosition: "top"
    });
  }
}
