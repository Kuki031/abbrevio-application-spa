import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthActionsService } from '../../auth-actions/auth-service/auth-actions.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthActionsService) { }

  isLoggedIn: boolean = false;
  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem("Bearer");
  }

  logOut(): void {
    this.authService.logout();
    location.assign("/home");
  }

}
