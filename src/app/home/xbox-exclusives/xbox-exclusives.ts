import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../interfaces/game.interface';
import { GameModalService } from '../../services/game-modal.service';

@Component({
  selector: 'app-xbox-exclusives',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './xbox-exclusives.html',
  styleUrl: './xbox-exclusives.css'
})
export class XboxExclusivesComponent implements OnInit {
  ASSETS_PATH = '/assets/images/';
  private modalService = inject(GameModalService);
  
  currentSection = 0;
  scrollProgress = 0;
  totalSections = 4;
  isInExclusivesSection = false;

  exclusiveGames: Game[] = [
    {
      id: 101,
      title: 'Halo Infinite',
      description: 'El legendario spartano Master Chief regresa en la aventura más épica de la franquicia.',
      image: 'halo.png',
      category: 'Acción',
      rating: 4.7,
      year: 2021,
      players: '1-24 jugadores',
      trailer: 'https://www.youtube.com/watch?v=PyMlV5_HRWk',
      developer: '343 Industries',
      platforms: ['Xbox Series X/S', 'Xbox One', 'PC'],
      price: 59.99,
      longDescription: 'Halo Infinite marca el regreso triunfal de Master Chief. Explora el misterioso anillo Zeta Halo en esta nueva aventura con mecánicas de mundo abierto.'
    },
    {
      id: 102,
      title: 'Forza Horizon 5',
      description: 'Explora los vibrantes paisajes de México en el festival de carreras más espectacular.',
      image: 'forza.png',
      category: 'Carreras',
      rating: 4.9,
      year: 2021,
      players: '1-72 jugadores',
      trailer: 'https://www.youtube.com/watch?v=FYH9n37B7Yw',
      developer: 'Playground Games',
      platforms: ['Xbox Series X/S', 'Xbox One', 'PC'],
      price: 59.99,
      longDescription: 'Forza Horizon 5 te lleva a México con el mundo más grande y diverso de la serie.'
    },
    {
      id: 103,
      title: 'Gears 5',
      description: 'La saga definitiva de acción continúa con Kait Diaz como protagonista.',
      image: 'gears.png',
      category: 'Acción',
      rating: 4.6,
      year: 2019,
      players: '1-5 jugadores',
      trailer: 'https://www.youtube.com/watch?v=UB3c-cQDZTk',
      developer: 'The Coalition',
      platforms: ['Xbox Series X/S', 'Xbox One', 'PC'],
      price: 39.99,
      longDescription: 'Gears 5 eleva la saga a nuevas alturas con una campaña épica y modo cooperativo mejorado.'
    },
    {
      id: 104,
      title: 'Starfield',
      description: 'Explora el espacio en la mayor aventura jamás creada por Bethesda.',
      image: 'starfield.jpg',
      category: 'RPG',
      rating: 4.4,
      year: 2023,
      players: '1 jugador',
      trailer: 'https://www.youtube.com/watch?v=kfYEiTdsyas',
      developer: 'Bethesda Game Studios',
      platforms: ['Xbox Series X/S', 'PC'],
      price: 69.99,
      longDescription: 'Starfield es el RPG de mundo abierto ambientado en el espacio con más de 1000 planetas para explorar.'
    }
  ];

  ngOnInit() {
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
    this.modalService.openModal(game);
  }
}