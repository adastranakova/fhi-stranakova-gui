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

  createUser(data: { memberId: string; name: string; email: string; balance?: number;
  }): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  updateUser(memberId: string, data: { name?: string; email?: string }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${memberId}`, data);
  }

  addFunds(memberId: string, amount: number): Observable<{ balance: number }> {
    return this.http.post<{ balance: number }>(`${this.apiUrl}/${memberId}/add-funds`, { amount });
  }

  deductFunds(memberId: string, amount: number): Observable<{ balance: number }> {
    return this.http.post<{ balance: number }>(`${this.apiUrl}/${memberId}/deduct-funds`, { amount });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
