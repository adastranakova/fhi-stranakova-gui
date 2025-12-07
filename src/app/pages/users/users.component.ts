import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { Column } from '../../models/column.model';
import { TableComponent } from '../../components/table/table.component';
import { CardComponent } from '../../components/card/card.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageTitleComponent } from '../../components/page-title/page-title.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableComponent,
    CardComponent,
    LoaderComponent,
    PageTitleComponent
  ],
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);

  columns: Column<User>[] = [
    { name: 'Member ID', value: (row) => row.memberId },
    { name: 'Name', value: (row) => row.name },
    { name: 'Email', value: (row) => row.email },
    { name: 'Balance', value: (row) => `$${row.balance.toFixed(2)}` }
  ];

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
}
