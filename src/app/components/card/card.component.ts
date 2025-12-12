import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// dekorator - oznacuje triedu ako Angular komponent (vytvorenie, vykreslenie)
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styles: []

})
export class CardComponent {}
