import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sobre-nosotros.html',
  styleUrl: './sobre-nosotros.css',
})
export class SobreNosotros {

}
