import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../interfaces/game.interface';
import { GameModalService } from '../../services/game-modal.service';
import { GamesService } from '../../services/games.service';

@Component({
  selector: 'app-local-coop-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './local-coop-games.html',
  styleUrl: './local-coop-games.css'
})
export class LocalCoopGamesComponent implements OnInit {
  ASSETS_PATH = '/assets/images/';
  private modalService = inject(GameModalService);
  private gamesService = inject(GamesService);

  currentCardIndex = 0;
  rotation = 0;
  private isRotating = false;

  coopGames: Game[] = [];

  ngOnInit() {
    // Obtener juegos cooperativos desde el servicio centralizado
    this.coopGames = this.gamesService.getCoopGames();
    // Inicializar posiciones de los elementos del carrusel
    this.initCarousel();
  }

  private initCarousel() {
    const totalItems = this.coopGames.length;
    const angleStep = 360 / totalItems;

    // Las posiciones se calculan en getItemTransform()
  }

  getItemTransform(index: number): string {
    const totalItems = this.coopGames.length;
    const angleStep = 360 / totalItems;
    const angle = index * angleStep;
    const radius = 400;

    return `rotateY(${angle}deg) translateZ(${radius}px)`;
  }

  rotateCarousel(direction: string) {
    if (this.isRotating) return;

    this.isRotating = true;
    const totalItems = this.coopGames.length;
    const angleStep = 360 / totalItems;

    if (direction === 'next') {
      this.currentCardIndex = (this.currentCardIndex + 1) % totalItems;
      this.rotation -= angleStep;
    } else {
      this.currentCardIndex = (this.currentCardIndex - 1 + totalItems) % totalItems;
      this.rotation += angleStep;
    }

    setTimeout(() => {
      this.isRotating = false;
    }, 800);
  }

  openGameModal(game: Game) {
    this.modalService.openModal(game);
  }
}
