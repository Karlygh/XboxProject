import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, HostListener, PLATFORM_ID, Inject, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Game } from '../../interfaces/game.interface';
import { GameModalService } from '../../services/game-modal.service';
import { GamesService } from '../../services/games.service';
import { ASSETS_PATHS } from '../../constants/app.constants';

@Component({
  selector: 'app-games-ea',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './games-ea.html',
  styleUrl: './games-ea.css',
})
export class GamesEa implements OnInit {
  ASSETS_PATH = ASSETS_PATHS.IMAGES;
  private modalService = inject(GameModalService);
  private gamesService = inject(GamesService);

  currentSlide = signal(0);
  slidesPerView = signal(3);

  games: Game[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Obtener juegos EA desde el servicio centralizado
    this.games = this.gamesService.getEAGames();

    if (isPlatformBrowser(this.platformId)) {
      this.updateSlidesPerView();
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateSlidesPerView();
    }
  }

  private updateSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1200) {
      this.slidesPerView.set(3);
    } else if (width >= 992) {
      this.slidesPerView.set(2);
    } else {
      this.slidesPerView.set(1);
    }
  }

  nextSlide() {
    const maxSlide = this.games.length - this.slidesPerView();
    if (this.currentSlide() < maxSlide) {
      this.currentSlide.update(val => val + 1);
    }
  }

  prevSlide() {
    if (this.currentSlide() > 0) {
      this.currentSlide.update(val => val - 1);
    }
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  getTransformStyle(): string {
    const slideWidth = 100 / this.slidesPerView();
    const offset = this.currentSlide() * slideWidth;
    return `translateX(-${offset}%)`;
  }

  isPrevDisabled(): boolean {
    return this.currentSlide() === 0;
  }

  isNextDisabled(): boolean {
    return this.currentSlide() >= this.games.length - this.slidesPerView();
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  }

  openGameModal(game: Game) {
    this.modalService.openModal(game);
  }
}
