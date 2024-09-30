import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = environment.apiUrl + "/meanings"
  private headers = {
    "Authorization": `Bearer ${localStorage.getItem("Bearer")}`,
    "Content-type": "application/json"
  }

  constructor(private http: HttpClient) { }

  getAllCommentsForMeaning(meaningId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${meaningId}/comments`, { headers: this.headers });
  }
}
