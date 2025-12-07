import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column } from '../../models/column.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styles: []

})
export class TableComponent<T> {
  @Input() columns: Column<T>[] = [];
  @Input() data: T[] = [];
}
