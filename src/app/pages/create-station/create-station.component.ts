import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StationsService } from '../../services/stations.service';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';

@Component({
  selector: 'app-create-station',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent,
    LoaderComponent,
    PageTitleComponent
  ],
  templateUrl: './create-station.component.html',
  styles: []
})
export class CreateStationComponent {
  name = signal('');
  address = signal('');
  numberOfSlots = signal(5);
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private stationsService: StationsService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.name() || !this.address() || !this.numberOfSlots()) {
      this.errorMessage.set('All fields are required');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.stationsService.createStation({
      name: this.name(),
      address: this.address(),
      numberOfSlots: this.numberOfSlots()
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/stations']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.error || 'Failed to create station');
      }
    });
  }

  updateName(value: string): void {
    this.name.set(value);
  }

  updateAddress(value: string): void {
    this.address.set(value);
  }

  updateNumberOfSlots(value: number): void {
    this.numberOfSlots.set(value);
  }
}
