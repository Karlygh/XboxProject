import { Injectable, signal, Renderer2, inject } from '@angular/core';
import { Game } from '../interfaces/game.interface';

@Injectable({
  providedIn: 'root'
})
export class GameModalService {
  private renderer = inject(Renderer2);
  private _isOpen = signal(false);
  private _selectedGame = signal<Game | null>(null);

  readonly isOpen = this._isOpen.asReadonly();
  readonly selectedGame = this._selectedGame.asReadonly();

  openModal(game: Game) {
    this._selectedGame.set(game);
    this._isOpen.set(true);
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  closeModal() {
    this._isOpen.set(false);
    this._selectedGame.set(null);
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }
}