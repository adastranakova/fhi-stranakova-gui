import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import {BikesService} from '../../services/bike.service';

@Component({
  selector: 'app-create-bike',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent,
    LoaderComponent,
    PageTitleComponent
  ],
  templateUrl: './create-bike.component.html',
  styles: []
})
export class CreateBikeComponent {
  bikeId = signal('');
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private bikesService: BikesService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.bikeId()) {
      this.errorMessage.set('Bike ID is required');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.bikesService.createBike({ id: this.bikeId() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/bikes']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.error || 'Failed to create bike');
      }
    });
  }

  updateBikeId(value: string): void {
    this.bikeId.set(value);
  }
}
