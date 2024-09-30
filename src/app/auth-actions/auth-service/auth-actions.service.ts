import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Auth } from '../../models/auth';
import { environment } from '../../../environments/environment.development';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthActionsService {
  ;
  private tokenType = "Bearer";
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<Auth> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = { username, password };
    return this.http.post<Auth>(`${this.apiUrl}/auth/login`, body, { headers });
  }

  logout(): void {
    localStorage.removeItem(this.tokenType);
  }

  register(username: string, email: string, password: string): Observable<void> {
    const requestBody = { username, email, password };
    return this.http.post<void>(`${this.apiUrl}/auth/register`, requestBody);
  }

  getMe(): Observable<User> {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(this.tokenType)}`
    });

    return this.http.get<User>(`${this.apiUrl}/auth/me`, { headers })
  }
}