import { Routes } from '@angular/router';
import {BikesComponent} from './pages/bikes/bikes.component';
import {CreateBikeComponent} from './pages/create-bike/create-bike.component';
import {UsersComponent} from './pages/users/users.component';
import {CreateUserComponent} from './pages/create-user/create-user.component';
import {StationsComponent} from './pages/stations/stations.component';
import {CreateStationComponent} from './pages/create-station/create-station.component';
import {RentalsComponent} from './pages/rentals/rentals.component';

export const routes: Routes = [
  { path: '', redirectTo: '/bikes', pathMatch: 'full' },
  { path: 'bikes', component: BikesComponent },
  { path: 'bikes/create', component: CreateBikeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/create', component: CreateUserComponent },
  { path: 'stations', component: StationsComponent },
  { path: 'stations/create', component: CreateStationComponent },
  { path: 'rentals', component: RentalsComponent }
];
