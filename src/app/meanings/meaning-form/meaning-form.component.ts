import { Component } from '@angular/core';
import { MeaningsService } from '../meanings.service';

@Component({
  selector: 'app-meaning-form',
  standalone: true,
  imports: [],
  templateUrl: './meaning-form.component.html',
  styleUrl: './meaning-form.component.css'
})
export class MeaningFormComponent {

  constructor(private meaningService: MeaningsService) { }

}
