import { Injectable, inject } from '@angular/core';
import { Game } from '../interfaces/game.interface';
import { GameModalService } from './game-modal.service';

@Injectable({
  providedIn: 'root'
})
export class GameCardService {
  private modalService = inject(GameModalService);

  /**
   * Abre el modal del juego
   * Centraliza la lógica que estaba duplicada en 5 componentes
   */
  openGameModal(game: Game): void {
    this.modalService.openModal(game);
  }
}
