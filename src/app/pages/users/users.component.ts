import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, LoaderComponent, PageTitleComponent],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);

  showEditModal = signal(false);
  editingUser = signal<User | null>(null);
  editName = signal('');
  editEmail = signal('');
  editError = signal('');
  updating = signal(false);

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading.set(false);
      }
    });
  }

  // po kliknuti na edit sa spusti,
  openEditModal(user: User): void {
    this.editingUser.set(user);
    this.editName.set(user.name);
    this.editEmail.set(user.email);
    this.editError.set('');
    this.showEditModal.set(true); // v sablone sa vykresli
  }

  // uzavretie modalu, ak prejde validacia, tabulka pouzivatelov sa obnovi
  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editingUser.set(null);
    this.editName.set('');
    this.editEmail.set('');
    this.editError.set('');
  }

  updateUser(): void {
    const user = this.editingUser();
    if (!user) return;

    if (!this.editName().trim()) {
      this.editError.set('Name is required');
      return;
    }

    if (!this.editEmail().trim()) {
      this.editError.set('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editEmail())) {
      this.editError.set('Please enter a valid email address');
      return;
    }

    this.updating.set(true);
    this.editError.set('');

    const updates: any = {};
    if (this.editName() !== user.name) updates.name = this.editName();
    if (this.editEmail() !== user.email) updates.email = this.editEmail();

    if (Object.keys(updates).length === 0) {
      this.closeEditModal();
      return;
    }

    this.usersService.updateUser(user.memberId, updates).subscribe({
      next: () => {
        this.updating.set(false);
        this.closeEditModal();
        this.loadUsers(); // Reload to show updated data
      },
      error: (error) => {
        this.updating.set(false);
        this.editError.set(error.error?.error || 'Failed to update user');
      }
    });
  }

  deleteUser(memberId: string): void {
    const user = this.users().find(u => u.memberId === memberId);
    if (!user) return;

    const confirmed = confirm(`Are you sure you want to delete user "${user.name}" (${memberId})?`);
    if (!confirmed) return;

    this.usersService.deleteUser(memberId).subscribe({
      next: () => {
        this.loadUsers(); // Reload after delete
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    });
  }

  addFunds(memberId: string): void {
    const amountStr = prompt('Enter amount to add:');
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    this.usersService.addFunds(memberId, amount).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error adding funds:', error);
        alert('Failed to add funds');
      }
    });
  }

  deductFunds(memberId: string): void {
    const amountStr = prompt('Enter amount to deduct:');
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    this.usersService.deductFunds(memberId, amount).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error deducting funds:', error);
        alert('Failed to deduct funds');
      }
    });
  }
}
