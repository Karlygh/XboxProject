import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../interfaces/game.interface';
import { GamesService } from '../../services/games.service';
import { GameCardService } from '../../services/game-card.service';
import { ASSETS_PATHS } from '../../constants/app.constants';

@Component({
  selector: 'app-xbox-exclusives',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './xbox-exclusives.html',
  styleUrl: './xbox-exclusives.css'
})
export class XboxExclusivesComponent implements OnInit {
  ASSETS_PATH = ASSETS_PATHS.IMAGES;
  protected gameCardService = inject(GameCardService);
  private gamesService = inject(GamesService);

  currentSection = 0;
  scrollProgress = 0;
  totalSections = 4;
  isInExclusivesSection = false;

  exclusiveGames: Game[] = [];

  ngOnInit() {
    // Obtener juegos exclusivos desde el servicio centralizado
    this.exclusiveGames = this.gamesService.getXboxExclusives();
    this.updateSection();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.updateSection();
  }

  private updateSection() {
    const component = document.querySelector('.parallax-wrapper') as HTMLElement;
    if (!component) return;

    const rect = component.getBoundingClientRect();
    const componentHeight = component.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Verificar si estamos en la sección de exclusivos
    this.isInExclusivesSection = rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2;

    const scrolled = -rect.top;

    // Calcular el progreso total del scroll (0 a 1)
    const totalProgress = scrolled / (componentHeight - viewportHeight);

    // Calcular sección basada en el progreso total
    const sectionIndex = totalProgress * this.totalSections;
    this.currentSection = Math.floor(sectionIndex);
    this.currentSection = Math.max(0, Math.min(this.currentSection, this.totalSections - 1));

    // Progreso dentro de la sección actual
    const sectionProgress = (sectionIndex - this.currentSection);
    this.scrollProgress = Math.max(0, Math.min(sectionProgress, 1));
  }

  scrollToSection(index: number) {
    const component = document.querySelector('.parallax-wrapper') as HTMLElement;
    if (!component) return;

    const rect = component.getBoundingClientRect();
    const currentScroll = window.pageYOffset;
    const componentTop = currentScroll + rect.top;
    const targetScroll = componentTop + (index * window.innerHeight);

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  }

  openGameModal(game: Game) {
    this.gameCardService.openGameModal(game);
  }
}
