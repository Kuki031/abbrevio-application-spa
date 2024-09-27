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

  updateAbbreviation(id: number, name: string): Observable<void> {

    const reqBody = {
      name
    }

    return this.http.patch<void>(`${this.apiUrl}/${id}`, reqBody, { headers: { "Authorization": `Bearer ${localStorage.getItem("Bearer")}`, 'Content-type': 'application/json' } })
  }

  createAbbreviation(name: string, userId: number): Observable<Abbreviation> {
    const reqBody = {
      name: name,
      user_id: userId
    }
    return this.http.post<Abbreviation>(`${this.apiUrl}`, reqBody, { headers: { "Authorization": `Bearer ${localStorage.getItem("Bearer")}` } })
  }

}
