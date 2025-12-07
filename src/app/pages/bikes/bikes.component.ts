import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Bike } from '../../models/bike.model';
import { Column } from '../../models/column.model';
import { TableComponent } from '../../components/table/table.component';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import {BikesService} from '../../services/bike.service';

@Component({
  selector: 'app-bikes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableComponent,
    CardComponent,
    LoaderComponent,
    PageTitleComponent
  ],
  templateUrl: './bikes.component.html',
  styles: []
})
export class BikesComponent implements OnInit {
  bikes = signal<Bike[]>([]);
  loading = signal(true);

  columns: Column<Bike>[] = [
    { name: 'Bike ID', value: (row) => row.id },
    { name: 'Status', value: (row) => row.status }
  ];

  constructor(private bikesService: BikesService) {}

  ngOnInit(): void {
    this.loadBikes();
  }

  loadBikes(): void {
    this.loading.set(true);
    this.bikesService.getAllBikes().subscribe({
      next: (data) => {
        this.bikes.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading bikes:', error);
        this.loading.set(false);
      }
    });
  }
}
