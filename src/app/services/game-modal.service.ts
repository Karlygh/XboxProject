import { Injectable, signal } from '@angular/core';
import { Game } from '../interfaces/game.interface';

@Injectable({
  providedIn: 'root'
})
export class GameModalService {
  private renderer: any;
  private _isOpen = signal(false);
  private _selectedGame = signal<Game | null>(null);

  readonly isOpen = this._isOpen.asReadonly();
  readonly selectedGame = this._selectedGame.asReadonly();

  setRenderer(renderer: any) {
    this.renderer = renderer;
  }

  openModal(game: Game) {
    this._selectedGame.set(game);
    this._isOpen.set(true);
    if (this.renderer) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    }
  }

  closeModal() {
    this._isOpen.set(false);
    this._selectedGame.set(null);
    if (this.renderer) {
      this.renderer.setStyle(document.body, 'overflow', 'auto');
    }
  }
}