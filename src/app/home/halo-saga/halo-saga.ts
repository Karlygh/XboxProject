import { Component, HostListener, OnInit, OnDestroy, inject, ElementRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Game } from '../../interfaces/game.interface';
import { GameModalService } from '../../services/game-modal.service';
import { GamesService } from '../../services/games.service';

@Component({
  selector: 'app-halo-saga',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './halo-saga.html',
  styleUrl: './halo-saga.css'
})
export class HaloSaga implements OnInit {
  ASSETS_PATH = '/assets/images/';
  private modalService = inject(GameModalService);
  private gamesService = inject(GamesService);
  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  hasAnimated = false;
  activeCardIndex = -1;
  isInHaloSection = false;

  // Datos de la saga Halo
  sagaTitle = 'HALO';
  sagaSubtitle = 'La saga legendaria que definió una generación';

  haloGames: Game[] = [];

  ngOnInit() {
    // Obtener juegos Halo desde el servicio centralizado
    this.haloGames = this.gamesService.getHaloGames();
    this.checkIfInViewport();

    // Usar RxJS para manejar el scroll event con limpieza automática
    fromEvent(window, 'scroll')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.checkIfInViewport());
  }

  private checkIfInViewport() {
    const section = this.elementRef.nativeElement.querySelector('.saga-section') as HTMLElement;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Buscar el footer en el documento (está en app-root ahora)
    const footerElement = document.querySelector('app-footer') as HTMLElement;

    let isFooterVisible = false;
    if (footerElement) {
      const footerRect = footerElement.getBoundingClientRect();
      // El footer es visible cuando su parte superior está en la pantalla
      isFooterVisible = footerRect.top < viewportHeight;
    }

    // Mostrar timeline solo si:
    // 1. Estamos viendo la sección Halo (su parte superior está cerca del viewport)
    // 2. El footer NO es visible
    const isHaloSectionInView = rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.1;
    this.isInHaloSection = isHaloSectionInView && !isFooterVisible;

    const isVisible = rect.top < viewportHeight * 0.6 && rect.bottom > 0;

    if (isVisible && !this.hasAnimated) {
      this.hasAnimated = true;
    }

    // Detectar qué card está activa en el viewport solo si estamos en la sección
    if (this.isInHaloSection) {
      this.detectActiveCard();
    } else {
      this.activeCardIndex = -1;
    }
  }

  private detectActiveCard() {
    const cards = this.elementRef.nativeElement.querySelectorAll('.game-card-cascade');
    const viewportCenter = window.innerHeight / 2;

    let closestIndex = -1;
    let closestDistance = Infinity;

    cards.forEach((card: HTMLElement, index: number) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < closestDistance && rect.top < window.innerHeight && rect.bottom > 0) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    this.activeCardIndex = closestIndex;
  }

  isYearActive(index: number): boolean {
    return this.activeCardIndex === index;
  }

  getCardDelay(index: number): string {
    return `${index * 0.15}s`;
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  }

  openGameModal(game: Game) {
    this.modalService.openModal(game);
  }
}
