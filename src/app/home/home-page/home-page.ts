import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeCabecera } from '../home-cabecera/home-cabecera';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule,RouterModule,HomeCabecera],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
