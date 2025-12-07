import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../models/menu-item.model';
import {APP_NAME} from '../../consts/consts';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent {
  appName = APP_NAME;

  menuItems: MenuItem[] = [
    { label: 'Bikes', routerLink: '/bikes' },
    { label: 'Users', routerLink: '/users' },
    { label: 'Stations', routerLink: '/stations' },
    { label: 'Rentals', routerLink: '/rentals' }
  ];
}
