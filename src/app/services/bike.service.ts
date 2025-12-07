import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bike } from '../models/bike.model';
import {API_URL} from '../consts/consts';


@Injectable({
  providedIn: 'root'
})
export class BikesService {
  private apiUrl = `${API_URL}/bikes`;

  constructor(private http: HttpClient) {}

  getAllBikes(): Observable<Bike[]> {
    return this.http.get<Bike[]>(this.apiUrl);
  }

  getBikeById(id: string): Observable<Bike> {
    return this.http.get<Bike>(`${this.apiUrl}/${id}`);
  }

  createBike(bike: { id: string }): Observable<Bike> {
    return this.http.post<Bike>(this.apiUrl, bike);
  }

  deleteBike(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
