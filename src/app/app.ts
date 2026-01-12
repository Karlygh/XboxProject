import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../components/navbar/navbar';
import { GameModalComponent } from './shared/game-modal/game-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, GameModalComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('xbox-project');
}