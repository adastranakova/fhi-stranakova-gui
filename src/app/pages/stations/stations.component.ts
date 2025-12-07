import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StationsService } from '../../services/stations.service';
import { Station } from '../../models/station.model';
import { Column } from '../../models/column.model';
import { TableComponent } from '../../components/table/table.component';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableComponent,
    CardComponent,
    LoaderComponent,
    PageTitleComponent
  ],
  templateUrl: './stations.component.html',
  styles: []
})
export class StationsComponent implements OnInit {
  stations = signal<Station[]>([]);
  loading = signal(true);

  columns: Column<Station>[] = [
    { name: 'Station Name', value: (row) => row.name },
    { name: 'Address', value: (row) => row.address },
    { name: 'Available Bikes', value: (row) => `${row.availableBikes} bikes` }
  ];

  constructor(private stationsService: StationsService) {}

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.loading.set(true);
    this.stationsService.getAllStations().subscribe({
      next: (data) => {
        this.stations.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading stations:', error);
        this.loading.set(false);
      }
    });
  }
}
