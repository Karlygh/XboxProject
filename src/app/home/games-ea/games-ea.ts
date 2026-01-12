import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, HostListener, PLATFORM_ID, Inject, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Game } from '../../interfaces/game.interface';
import { GameModalService } from '../../services/game-modal.service';

@Component({
  selector: 'app-games-ea',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './games-ea.html',
  styleUrl: './games-ea.css',
})
export class GamesEa implements OnInit {
  ASSETS_PATH = '/assets/images/';
  private modalService = inject(GameModalService);
  
  currentSlide = signal(0);
  slidesPerView = signal(3);
  
  games: Game[] = [
    {
      id: 1,
      title: 'FIFA 26',
      description: 'El mejor simulador de fútbol con gráficos realistas y jugabilidad mejorada.',
      image: 'eafc26.png',
      category: 'Deportes',
      rating: 4.5,
      year: 2024,
      players: '1-4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=TSi0iJYSQ24&pp=ugMGCgJlbhABugUEEgJlbsoFEGVhIGZjIDI2IHRyYWlsZXLYBwE%3D',
      developer: 'EA Sports',
      platforms: ['Xbox Series X/S', 'PlayStation 5', 'PC'],
      price: 64.99,
      longDescription: 'FIFA 26 lleva el fútbol a un nuevo nivel con tecnología HyperMotion V, gráficos fotorrealistas y la experiencia más auténtica jamás creada. Juega con más de 700 equipos de todo el mundo.'
    },
    {
      id: 2,
      title: 'Battlefield 6',
      description: 'Intensas batallas multijugador en escenarios futuristas.',
      image: 'battelfield.png',
      category: 'Acción',
      rating: 4.2,
      year: 2024,
      players: '1-128 jugadores',
      trailer: 'https://www.youtube.com/watch?v=pgNCgJG0vnY&pp=ygUVYmF0dGVsZmllbGQgNiB0cmFpbGVy',
      developer: 'DICE',
      platforms: ['Xbox Series X/S', 'PlayStation 5', 'PC'],
      price: 54.99,
      longDescription: 'Battlefield 6 redefine la guerra moderna con mapas masivos, destrucción total y batallas épicas de 128 jugadores. Experimenta el caos de la guerra como nunca antes.'
    },
    {
      id: 3,
      title: 'Apex Legends',
      description: 'Battle royale de alta velocidad con personajes únicos.',
      image: 'apex.png',
      category: 'Battle Royale',
      rating: 4.7,
      year: 2019,
      players: '1-60 jugadores',
      trailer: 'https://www.youtube.com/watch?v=oQtHENM_GZU&pp=ygUUYXBleCBsZWdlbmRzIHRyYWlsZXI%3D',
      developer: 'Respawn Entertainment',
      platforms: ['Xbox', 'PlayStation', 'PC', 'Nintendo Switch'],
      price: 0,
      longDescription: 'Apex Legends es un battle royale gratuito donde equipos de tres leyendas luchan por la fama y la fortuna en los confines del universo. Domina un arsenal en constante evolución de armas y equipamiento.'
    },
    {
      id: 4,
      title: 'Madden NFL 24',
      description: 'La experiencia definitiva de fútbol americano.',
      image: 'nfl.png',
      category: 'Deportes',
      rating: 4.3,
      year: 2023,
      players: '1-4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=4o6xDjg2B54&pp=ygUVbWFkZGVuIG5mbCAyNCB0cmFpbGVy',
      developer: 'EA Tiburon',
      platforms: ['Xbox Series X/S', 'PlayStation 5', 'PC'],
      price: 64.99,
      longDescription: 'Madden NFL 24 ofrece la experiencia más auténtica del fútbol americano con FieldSENSE, animaciones mejoradas y el modo Franchise más profundo hasta la fecha.'
    },
    {
      id: 5,
      title: 'Star Wars Jedi',
      description: 'Aventura épica en el universo de Star Wars.',
      image: 'jedi.png',
      category: 'Aventura',
      rating: 4.8,
      year: 2023,
      players: '1 jugador',
      trailer: 'https://www.youtube.com/watch?v=0GLbwkfhYZk&pp=ygUXc3RhcnMgd2FycyBqZWRpIHRyYWlsZXLSBwkJTQoBhyohjO8%3D',
      developer: 'Respawn Entertainment',
      platforms: ['Xbox Series X/S', 'PlayStation 5', 'PC'],
      price: 54.99,
      longDescription: 'Continúa la historia de Cal Kestis en esta secuela épica. Domina nuevas habilidades de la Fuerza, explora mundos diversos y enfrenta el Imperio en esta aventura cinematográfica.'
    },
    {
      id: 6,
      title: 'Need for Speed',
      description: 'Carreras callejeras con personalización extrema.',
      image: 'nfs.png',
      category: 'Carreras',
      rating: 4.4,
      year: 2022,
      players: '1-16 jugadores',
      trailer: 'https://www.youtube.com/watch?v=H2Y8XCe7F9E&pp=ygUkZGVlZCBmb3Igc3BlZWQgeGJvcyBzZXJpZXMgeCB0cmFpbGVy0gcJCU0KAYcqIYzv',
      developer: 'Criterion Games',
      platforms: ['Xbox Series X/S', 'PlayStation 5', 'PC'],
      price: 44.99,
      longDescription: 'Need for Speed regresa con carreras callejeras intensas, personalización profunda de vehículos y una campaña emocionante en un mundo abierto lleno de desafíos.'
    },
    {
      id: 7,
      title: 'The Sims 4',
      description: 'Crea y controla personas en un mundo virtual.',
      image: 'sims.png',
      category: 'Simulación',
      rating: 4.6,
      year: 2014,
      players: '1 jugador',
      trailer: 'https://www.youtube.com/watch?v=1xZn8XUUat8&list=PLtADktUah7ywPDLwfNFpJypaJkv9IJ2Gv',
      developer: 'Maxis',
      platforms: ['Xbox', 'PlayStation', 'PC'],
      price: 34.99,
      longDescription: 'The Sims 4 te permite crear Sims únicos, construir casas perfectas y explorar mundos vibrantes. Vive historias extraordinarias y da rienda suelta a tu imaginación.'
    },
    {
      id: 8,
      title: 'Dead Space',
      description: 'Terror y supervivencia en el espacio profundo.',
      image: 'deadspace.png',
      category: 'Terror',
      rating: 4.5,
      year: 2023,
      players: '1 jugador',
      trailer: 'https://www.youtube.com/watch?v=ctQl9wa3ydE&pp=ygUcZGVhZCBzcGFjZSByZW1hc3RlcmQgdHJhaWxlcg%3D%3D',
      developer: 'Motive Studio',
      platforms: ['Xbox Series X/S', 'PlayStation 5', 'PC'],
      price: 54.99,
      longDescription: 'El clásico de terror espacial regresa completamente reconstruido. Experimenta la pesadilla de Isaac Clarke en la USG Ishimura con gráficos de nueva generación y audio inmersivo.'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
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