import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../interfaces/game.interface';
import { GameModalService } from '../../services/game-modal.service';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container>
      <ng-content></ng-content>
    </ng-container>
  `,
  styles: []
})
export class GameCardComponent {
  @Input() game!: Game;
  @Output() cardClicked = new EventEmitter<Game>();

  private modalService = inject(GameModalService);

  openGameModal(): void {
    this.cardClicked.emit(this.game);
    this.modalService.openModal(this.game);
  }
}
