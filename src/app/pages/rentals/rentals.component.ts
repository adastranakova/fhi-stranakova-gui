import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { RentalsService } from '../../services/rentals.service';
import { UsersService } from '../../services/users.service';
import { StationsService } from '../../services/stations.service';

interface ActiveRental {
  rentalId: number;
  memberId: string;
  userName: string;
  bikeId: string;
  startTime: Date;
}

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, LoaderComponent, PageTitleComponent],
  templateUrl: './rentals.component.html',
  styles: []
})
export class RentalsComponent implements OnInit {
  activeRentals = signal<ActiveRental[]>([]);
  loading = signal(true);
  showRentModal = signal(false);
  availableUsers = signal<any[]>([]);
  availableStations = signal<any[]>([]);
  availableBikesAtStation = signal<any[]>([]);
  selectedMemberId = signal('');
  selectedStationName = signal('');
  selectedBikeId = signal('');
  rentError = signal('');
  renting = signal(false);

  showReturnModal = signal(false);
  returnMemberId = signal('');
  returnStationName = signal('');
  returnError = signal('');
  returning = signal(false);

  constructor(
    private rentalsService: RentalsService,
    private usersService: UsersService,
    private stationsService: StationsService
  ) {}

  ngOnInit(): void {
    this.loadActiveRentals();
    this.loadUsersAndStations();

    setInterval(() => this.loadActiveRentals(), 30000);
  }

  loadActiveRentals(): void {
    this.loading.set(true);

    this.rentalsService.getAllActiveRentals().subscribe({
      next: (rentals) => {
        this.activeRentals.set(rentals);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading active rentals:', error);
        this.activeRentals.set([]);
        this.loading.set(false);
      }
    });
  }

  loadUsersAndStations(): void {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.availableUsers.set(users);
      },
      error: (error) => console.error('Error loading users:', error)
    });

    this.stationsService.getAllStations().subscribe({
      next: (stations) => {
        this.availableStations.set(stations);
      },
      error: (error) => console.error('Error loading stations:', error)
    });
  }

  onStationChange(stationName: string): void {
    this.selectedStationName.set(stationName);
    this.selectedBikeId.set('');
    this.availableBikesAtStation.set([]);

    if (!stationName) return;

    const station = this.availableStations().find(s => s.name === stationName);
    if (!station) return;

    // Get bikes at this station
    const bikes = station.slots
      .filter((slot: any) => slot.bikeId !== null)
      .map((slot: any) => ({
        bikeId: slot.bikeId,
        slotNumber: slot.slotNumber
      }));

    this.availableBikesAtStation.set(bikes);
  }

  getDuration(startTime: Date): number {
    const now = new Date();
    const start = new Date(startTime);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / 60000);
  }

  calculateCost(minutes: number): number {
    return Math.max(0, (minutes - 30) * 0.15);
  }

  openRentModal(): void {
    this.showRentModal.set(true);
    this.selectedMemberId.set('');
    this.selectedStationName.set('');
    this.selectedBikeId.set('');
    this.availableBikesAtStation.set([]);
    this.rentError.set('');
  }

  closeRentModal(): void {
    this.showRentModal.set(false);
  }

  // ✅ SIMPLIFIED: Just send user + bike ID (no password!)
  rentBike(): void {
    if (!this.selectedMemberId() || !this.selectedBikeId()) {
      this.rentError.set('Please select user and bike');
      return;
    }

    this.renting.set(true);
    this.rentError.set('');

    this.rentalsService.rentBike({
      memberId: this.selectedMemberId(),
      bikeId: this.selectedBikeId()
    }).subscribe({
      next: (response) => {
        this.renting.set(false);
        this.closeRentModal();
        this.loadActiveRentals();
        this.loadUsersAndStations();
        alert(`Bike ${response.bikeId} rented successfully!`);
      },
      error: (error) => {
        this.renting.set(false);
        this.rentError.set(error.error?.error || 'Failed to rent bike');
      }
    });
  }

  // ===================================
  // RETURN BIKE
  // ===================================
  openReturnModal(rental: ActiveRental): void {
    this.showReturnModal.set(true);
    this.returnMemberId.set(rental.memberId);
    this.returnStationName.set('');
    this.returnError.set('');
  }

  closeReturnModal(): void {
    this.showReturnModal.set(false);
  }

  returnBike(): void {
    if (!this.returnStationName()) {
      this.returnError.set('Please select a station');
      return;
    }

    const rental = this.activeRentals().find(r => r.memberId === this.returnMemberId());
    if (!rental) {
      this.returnError.set('Rental not found');
      return;
    }

    const duration = this.getDuration(rental.startTime);
    const cost = this.calculateCost(duration);

    if (!confirm(
      `Return bike?\n\n` +
      `Duration: ${duration} minutes\n` +
      `Cost: $${cost.toFixed(2)}\n\n` +
      `Continue?`
    )) {
      return;
    }

    this.returning.set(true);
    this.returnError.set('');

    this.rentalsService.returnBike({
      memberId: this.returnMemberId(),
      stationName: this.returnStationName()
    }).subscribe({
      next: (response) => {
        this.returning.set(false);
        this.closeReturnModal();
        this.loadActiveRentals();
        this.loadUsersAndStations();
        alert(
          `Bike returned successfully!\n\n` +
          `Slot: ${response.slotNumber}\n` +
          `Cost: $${response.cost.toFixed(2)}\n` +
          `New Balance: $${response.balance.toFixed(2)}`
        );
      },
      error: (error) => {
        this.returning.set(false);
        this.returnError.set(error.error?.error || 'Failed to return bike');
      }
    });
  }
}
