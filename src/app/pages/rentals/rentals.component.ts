import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { Column } from '../../models/column.model';
import { TableComponent } from '../../components/table/table.component';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    CardComponent,
    LoaderComponent,
    PageTitleComponent
  ],
  templateUrl: './rentals.component.html',
  styles: []
})
export class RentalsComponent implements OnInit {
  activeRentals = signal<any[]>([]);
  loading = signal(true);

  columns: Column<any>[] = [
    { name: 'Member ID', value: (row) => row.memberId },
    { name: 'User Name', value: (row) => row.userName },
    { name: 'Bike ID', value: (row) => row.bikeId },
    { name: 'Duration', value: (row) => `${row.duration} min` }
  ];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadActiveRentals();
  }

  loadActiveRentals(): void {
    this.loading.set(true);
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        const rentals = users
          .filter(user => user.hasActiveRental)
          .map(user => ({
            memberId: user.memberId,
            userName: user.name,
            bikeId: 'BIKE???',
            duration: 0
          }));
        this.activeRentals.set(rentals);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading rentals:', error);
        this.loading.set(false);
      }
    });
  }
}
