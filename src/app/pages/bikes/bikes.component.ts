import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Bike } from '../../models/bike.model';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import {BikesService} from '../../services/bike.service';

@Component({
  selector: 'app-bikes',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, LoaderComponent, PageTitleComponent],
  templateUrl: './bikes.component.html',
  styles: []
})

// trieda implementuje rozhranie OnInit (nacitanie dat z API, nastavenie premennych, inicializacia)*
export class BikesComponent implements OnInit {
  bikes = signal<Bike[]>([]);
  loading = signal(true);

  constructor(private bikesService: BikesService) {}

  // toto musi obsahovat*
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

  changeStatus(bikeId: string): void {
    const bike = this.bikes().find(b => b.id === bikeId);

    if (!bike) {
      console.log('Bike not found in array');
      return;
    }

    // vieme sa medzi nimi cyklovat na ukazku zmeny: AVAILABLE → MAINTENANCE → RENTED → AVAILABLE
    let newStatus: string;
    if (bike.status === 'AVAILABLE') {
      newStatus = 'MAINTENANCE';
    } else if (bike.status === 'MAINTENANCE') {
      newStatus = 'RENTED';
    } else if (bike.status === 'RENTED') {
      newStatus = 'AVAILABLE';
    } else {
      return;
    }

    console.log('Calling service to update bike:', bikeId, 'to:', newStatus);

    this.bikesService.updateBikeStatus(bikeId, newStatus).subscribe({
      next: (response) => {
        console.log('SUCCESS:', response);
        this.bikes.update(bikes =>
          bikes.map(b => b.id === bikeId ? { ...b, status: newStatus } : b)
        );
      },
      error: (error) => {
        console.error('ERROR:', error);
        alert('Failed to update bike status');
      }
    });
  }

  deleteBike(bikeId: string): void {
    if (!confirm(`Delete bike ${bikeId}?`)) return;

    this.bikesService.deleteBike(bikeId).subscribe({
      next: () => {
        this.bikes.update(bikes => bikes.filter(b => b.id !== bikeId));
      },
      error: (error) => {
        console.error('Error deleting bike:', error);
        const message = error.error?.error || 'Failed to delete bike';
        alert(message); // neda sa vymazat bicykel s historiou prenajmov
      }
    });
  }
}
