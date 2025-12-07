import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rental } from '../models/rental.model';
import {API_URL} from '../consts/consts';


@Injectable({
  providedIn: 'root'
})
export class RentalsService {
  private apiUrl = `${API_URL}/rentals`;

  constructor(private http: HttpClient) {}

  rentBike(data: { memberId: string; stationName: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/rent`, data);
  }

  returnBike(data: { memberId: string; stationName: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/return`, data);
  }

  getActiveRental(memberId: string): Observable<Rental> {
    return this.http.get<Rental>(`${this.apiUrl}/${memberId}`);
  }
}
