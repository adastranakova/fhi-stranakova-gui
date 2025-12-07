import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Station } from '../models/station.model';
import {API_URL} from '../consts/consts';


@Injectable({
  providedIn: 'root'
})
export class StationsService {
  private apiUrl = `${API_URL}/stations`;

  constructor(private http: HttpClient) {}

  getAllStations(): Observable<Station[]> {
    return this.http.get<Station[]>(this.apiUrl);
  }

  getStationByName(name: string): Observable<Station> {
    return this.http.get<Station>(`${this.apiUrl}/${name}`);
  }

  createStation(station: { name: string; address: string; numberOfSlots: number }): Observable<Station> {
    return this.http.post<Station>(this.apiUrl, station);
  }
}
