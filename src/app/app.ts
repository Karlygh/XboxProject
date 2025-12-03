import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeCabecera } from './home/home-cabecera/home-cabecera';
import { Navbar } from '../components/navbar/navbar';
import { HomePage } from './home/home-page/home-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar,HomePage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('xbox-project');
}
