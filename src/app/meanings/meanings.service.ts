import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MeaningsService {

  private apiUrl = environment.apiUrl + "/abbreviations";
  headers: any = { 'Content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("Bearer")}` }


  constructor(private http: HttpClient) { }

  createMeaningForAbbreviation(description: string, abbrevId: number): Observable<void> {
    const reqBody = {
      description
    }
    return this.http.post<void>(`${this.apiUrl}/${abbrevId}/meanings`, reqBody, { headers: this.headers })
  }

  updateMeaningForAbbreviation(description: string, abbrevId: number, meaningId: number): Observable<void> {
    const reqBody = {
      description
    }
    return this.http.patch<void>(`${this.apiUrl}/${abbrevId}/meanings/${meaningId}`, reqBody, { headers: this.headers });
  }


}
