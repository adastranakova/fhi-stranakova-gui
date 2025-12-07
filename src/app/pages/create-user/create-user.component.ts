import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent,
    LoaderComponent,
    PageTitleComponent
  ],
  templateUrl: './create-user.component.html',
  styles: []
})
export class CreateUserComponent {
  name = signal('');
  email = signal('');
  memberId = signal('');
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.name() || !this.email() || !this.memberId()) {
      this.errorMessage.set('All fields are required');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.usersService.createUser({
      name: this.name(),
      email: this.email(),
      memberId: this.memberId()
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/users']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.error || 'Failed to create user');
      }
    });
  }

  updateName(value: string): void {
    this.name.set(value);
  }

  updateEmail(value: string): void {
    this.email.set(value);
  }

  updateMemberId(value: string): void {
    this.memberId.set(value);
  }
}
