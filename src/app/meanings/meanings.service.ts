import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Meaning } from '../models/meaning';
import { Data } from '@angular/router';
import { Vote } from '../models/vote';

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

  getAllMeaningsForAbbreviation(abbrevId: number): Observable<Meaning[]> {
    return this.http.get<Meaning[]>(`${this.apiUrl}/${abbrevId}/meanings`, { headers: this.headers });
  }

  deleteMeaningForAbbreviation(abbrevId: number, meaningId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${abbrevId}/meanings/${meaningId}`, { headers: this.headers });
  }

  voteForMeaning(meaningId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/votes/${meaningId}/meanings`, null, { headers: this.headers });
  }

  getVoteForMeaning(meaningId: number): Observable<Vote> {
    return this.http.get<Vote>(`${this.apiUrl}/votes/${meaningId}/meanings`, { headers: this.headers });
  }
}
