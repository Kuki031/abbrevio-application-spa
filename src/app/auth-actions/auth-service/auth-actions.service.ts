import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthActionsService {

  private apiUrl = `${environment.apiUrl}/auth/login`;
  private tokenType = "Bearer";

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify({ username, password });
    return this.http.post<User>(this.apiUrl, body, { headers });
  }

  logout(): void {
    localStorage.removeItem(this.tokenType);
  }
}