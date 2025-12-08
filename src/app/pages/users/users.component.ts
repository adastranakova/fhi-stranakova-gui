import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, LoaderComponent, PageTitleComponent],
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);

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

  editUser(memberId: string): void {
    const user = this.users().find(u => u.memberId === memberId);
    if (!user) return;

    const name = prompt('New name (leave empty to keep current):', user.name);
    const email = prompt('New email (leave empty to keep current):', user.email);

    if (!name && !email) return;

    const updates: any = {};
    if (name && name !== user.name) updates.name = name;
    if (email && email !== user.email) updates.email = email;

    if (Object.keys(updates).length === 0) return;

    this.usersService.updateUser(memberId, updates).subscribe({
      next: () => {
        this.users.update(users =>
          users.map(u => u.memberId === memberId ? { ...u, ...updates } : u)
        );
      },
      error: (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update user');
      }
    });
  }

  addFunds(memberId: string): void {
    const amountStr = prompt('Amount to add:');
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }

    this.usersService.addFunds(memberId, amount).subscribe({
      next: (response) => {
        this.users.update(users =>
          users.map(u => u.memberId === memberId ? { ...u, balance: response.balance } : u)
        );
      },
      error: (error) => {
        console.error('Error adding funds:', error);
        alert('Failed to add funds');
      }
    });
  }

  deductFunds(memberId: string): void {
    const amountStr = prompt('Amount to deduct:');
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }

    this.usersService.deductFunds(memberId, amount).subscribe({
      next: (response) => {
        this.users.update(users =>
          users.map(u => u.memberId === memberId ? { ...u, balance: response.balance } : u)
        );
      },
      error: (error) => {
        console.error('Error deducting funds:', error);
        alert('Failed to deduct funds - may be insufficient balance');
      }
    });
  }

  deleteUser(memberId: string): void {
    if (!confirm(`Delete user ${memberId}?`)) return;

    this.usersService.deleteUser(memberId).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u.memberId !== memberId));
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    });
  }
}
