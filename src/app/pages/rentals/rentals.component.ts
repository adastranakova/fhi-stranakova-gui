import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';

interface Rental {
  id: number;
  memberId: string;
  userName: string;
  bikeId: string;
  startTime: Date;
}

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, CardComponent, LoaderComponent, PageTitleComponent],
  templateUrl: './rentals.component.html',
  styles: []
})
export class RentalsComponent implements OnInit {
  rentals = signal<Rental[]>([]);
  loading = signal(false);
  nextId = 1;

  ngOnInit(): void {
    // Load sample data - one rental started 45 minutes ago
    this.rentals.set([
      {
        id: this.nextId++,
        memberId: 'MEM001',
        userName: 'Alice Smith',
        bikeId: 'BIKE002',
        startTime: new Date(Date.now() - 45 * 60 * 1000)
      }
    ]);
  }

  getDuration(startTime: Date): number {
    const now = new Date();
    const diff = now.getTime() - new Date(startTime).getTime();
    return Math.floor(diff / 60000); // Convert to minutes
  }

  calculateCost(minutes: number): number {
    // First 30 minutes free, then $0.15 per minute
    return Math.max(0, (minutes - 30) * 0.15);
  }

  addRental(): void {
    const memberId = prompt('Enter Member ID:');
    const userName = prompt('Enter User Name:');
    const bikeId = prompt('Enter Bike ID:');

    if (!memberId || !userName || !bikeId) {
      alert('All fields required');
      return;
    }

    const rental: Rental = {
      id: this.nextId++,
      memberId,
      userName,
      bikeId,
      startTime: new Date()
    };

    this.rentals.update(rentals => [...rentals, rental]);
  }

  endRental(id: number): void {
    const rental = this.rentals().find(r => r.id === id);
    if (!rental) return;

    const duration = this.getDuration(rental.startTime);
    const cost = this.calculateCost(duration);

    if (confirm(`End rental?\nDuration: ${duration} min\nCost: $${cost.toFixed(2)}`)) {
      this.rentals.update(rentals => rentals.filter(r => r.id !== id));
      alert(`Rental ended! Charged: $${cost.toFixed(2)}`);
    }
  }

  deleteRental(id: number): void {
    if (!confirm('Delete this rental?')) return;
    this.rentals.update(rentals => rentals.filter(r => r.id !== id));
  }
}
