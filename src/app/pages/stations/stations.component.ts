import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StationsService } from '../../services/stations.service';
import { Station } from '../../models/station.model';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, LoaderComponent, PageTitleComponent],
  templateUrl: './stations.component.html',
  styles: [`
    .modal {
      display: block;
      background: rgba(0,0,0,0.5);
    }
    .slot-item {
      padding: 10px;
      margin: 5px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .slot-empty {
      background-color: #f8f9fa;
    }
    .slot-occupied {
      background-color: #d4edda;
    }
  `]
})
export class StationsComponent implements OnInit {
  stations = signal<Station[]>([]);
  loading = signal(true);
  showModal = signal(false);
  selectedStation = signal<string>('');
  modalSlots = signal<any[]>([]);

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

  editStation(name: string): void {
    const station = this.stations().find(s => s.name === name);
    if (!station) return;

    const newName = prompt('New name (leave empty to keep current):', station.name);
    const newAddress = prompt('New address (leave empty to keep current):', station.address);

    if (!newName && !newAddress) return;

    const updates: any = {};
    if (newName && newName !== station.name) updates.newName = newName;
    if (newAddress && newAddress !== station.address) updates.address = newAddress;

    if (Object.keys(updates).length === 0) return;

    this.stationsService.updateStation(name, updates).subscribe({
      next: (updated) => {
        this.stations.update(stations => {
          if (updates.newName) {
            return stations.map(s => s.name === name ? { ...s, name: updated.name, address: updated.address } : s);
          }
          return stations.map(s => s.name === name ? { ...s, address: updated.address } : s);
        });
      },
      error: (error) => {
        console.error('Error updating station:', error);
        alert('Failed to update station');
      }
    });
  }

  deleteStation(name: string): void {
    if (!confirm(`Delete station ${name}?`)) return;

    this.stationsService.deleteStation(name).subscribe({
      next: () => {
        this.stations.update(stations => stations.filter(s => s.name !== name));
      },
      error: (error) => {
        console.error('Error deleting station:', error);
        alert('Failed to delete station');
      }
    });
  }

  openManageBikes(stationName: string): void {
    const station = this.stations().find(s => s.name === stationName);
    if (!station) return;

    this.selectedStation.set(stationName);

    // Create slots array (simplified - showing slot numbers)
    const slots = [];
    for (let i = 1; i <= station.numberOfSlots; i++) {
      slots.push({
        slotNumber: i,
        isEmpty: true,
        bikeId: null
      });
    }

    this.modalSlots.set(slots);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedStation.set('');
    this.modalSlots.set([]);
  }

  addBikeToSlot(slotNumber: number): void {
    const bikeId = prompt('Enter Bike ID to add to this slot:');
    if (!bikeId) return;

    const stationName = this.selectedStation();

    this.stationsService.lockBike(stationName, bikeId, slotNumber).subscribe({
      next: (response) => {
        alert(`Bike locked successfully!\nPassword: ${response.password}\n(Save this password for unlocking)`);

        // Update slot display
        this.modalSlots.update(slots =>
          slots.map(s => s.slotNumber === slotNumber
            ? { ...s, isEmpty: false, bikeId: bikeId }
            : s
          )
        );

        // Refresh stations list to update available bikes count
        this.loadStations();
      },
      error: (error) => {
        console.error('Error locking bike:', error);
        alert('Failed to lock bike. Make sure the bike exists and slot is empty.');
      }
    });
  }

  unlockBikeFromSlot(slotNumber: number): void {
    const password = prompt('Enter password to unlock this bike:');
    if (!password) return;

    const stationName = this.selectedStation();

    this.stationsService.unlockBike(stationName, password).subscribe({
      next: (response) => {
        alert(`Bike ${response.bikeId} unlocked successfully!`);

        // Update slot display
        this.modalSlots.update(slots =>
          slots.map(s => s.slotNumber === slotNumber
            ? { ...s, isEmpty: true, bikeId: null }
            : s
          )
        );

        // Refresh stations list
        this.loadStations();
      },
      error: (error) => {
        console.error('Error unlocking bike:', error);
        alert('Failed to unlock bike. Check the password.');
      }
    });
  }
}
