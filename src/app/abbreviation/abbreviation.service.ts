import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Abbreviation } from '../models/abbreviation';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AbbreviationService {

  private apiUrl = environment.apiUrl + "/abbreviations";

  constructor(private http: HttpClient) { }

  getMatchedAbbreviations(name: string): Observable<Abbreviation[]> {
    return this.http.get<Abbreviation[]>(`${this.apiUrl}/contains/${name}`);
  }

  getSingleAbbreviation(id: number): Observable<Abbreviation> {
    return this.http.get<Abbreviation>(`${this.apiUrl}/${id}`);
  }

  getMyAbbreviations(): Observable<Abbreviation[]> {
    return this.http.get<Abbreviation[]>(`${this.apiUrl}/my-abbreviations`, { headers: { "Authorization": `Bearer ${localStorage.getItem("Bearer")}` } });
  }

  deleteAbbreviation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: { "Authorization": `Bearer ${localStorage.getItem("Bearer")}` } });
  }

}
