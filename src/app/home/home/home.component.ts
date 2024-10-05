import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbbreviationService } from '../../abbreviation/abbreviation.service';
import { Abbreviation } from '../../models/abbreviation';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  recentSearches: Abbreviation[] = [];
  recentAdds: Abbreviation[] = [];

  constructor(private abbreviationService: AbbreviationService) { }
  ngOnInit(): void {
    this.isLoggedIn = !localStorage.getItem("Bearer") ? false : true;

    this.getRecentSearches();
    this.getRecentAdds();

  }

  getRecentSearches(): void {
    this.abbreviationService.getRecentSearches().subscribe((data: Abbreviation[]) => {
      this.recentSearches = data;
    })
  }

  getRecentAdds(): void {
    this.abbreviationService.getRecentlyAdded().subscribe((data: Abbreviation[]) => {
      this.recentAdds = data;
    })
  }
}
