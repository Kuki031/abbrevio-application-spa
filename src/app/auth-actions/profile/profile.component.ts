import { Component } from '@angular/core';
import { AuthActionsService } from '../auth-service/auth-actions.service';
import { User } from '../../models/user';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {


  user: any = "";

  constructor(private authService: AuthActionsService) { }

  ngOnInit(): void {
    this.authService.getMe().subscribe((data) => {
      this.user = data;

    },
      (error) => {
        console.error(error);
      }
    )
  }
}
