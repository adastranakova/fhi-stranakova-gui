import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import {API_URL} from '../consts/consts';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${API_URL}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: { name: string; email: string; memberId: string }): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  addFunds(memberId: string, amount: number): Observable<{ balance: number }> {
    return this.http.post<{ balance: number }>(`${this.apiUrl}/${memberId}/funds`, { amount });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
