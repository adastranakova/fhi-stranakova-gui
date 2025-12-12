import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentalsService {
  private apiUrl = 'http://localhost:3000/rentals';

  constructor(private http: HttpClient) {}

  rentBike(data: { memberId: string; bikeId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/rent`, data);
  }

  returnBike(data: { memberId: string; stationName: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/return`, data);
  }

  getAllActiveRentals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/active`);
  }

  getActiveRental(memberId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${memberId}`);
  }
}
