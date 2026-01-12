import { Component, HostListener, OnInit, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../interfaces/game.interface';
import { GameModalService } from '../../services/game-modal.service';

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
  private elementRef = inject(ElementRef);
  
  currentCardIndex = 0;
  scrollProgress = 0;
  private isScrolling = false;
  private isOverCards = false;
  private scrollAccumulator = 0;
  private readonly SCROLL_THRESHOLD_DOWN = 80;
  private readonly SCROLL_THRESHOLD_UP = 40;
  private wasInViewport = false;

  coopGames: Game[] = [
    {
      id: 201,
      title: 'It Takes Two',
      description: 'Aventura cooperativa para 2 jugadores. Una pareja transformada en muñecos debe trabajar juntos para salvar su relación en este juego ganador del GOTY 2021.',
      image: 'ittakestwo.jpg',
      category: 'Aventura Cooperativa',
      rating: 4.9,
      year: 2021,
      players: '2 jugadores',
      trailer: 'https://www.youtube.com/watch?v=GAJQeM0Fr5I',
      developer: 'Hazelight Studios',
      platforms: ['Xbox Series X/S', 'PlayStation', 'PC'],
      price: 39.99,
      longDescription: 'It Takes Two es una aventura cooperativa innovadora donde cada nivel ofrece mecánicas únicas. Solo se necesita una copia del juego para jugar con un amigo gracias al Friend\'s Pass.'
    },
    {
      id: 202,
      title: 'Overcooked 2',
      description: 'Caos culinario para hasta 4 jugadores. Cocina, sirve y sobrevive en las cocinas más locas mientras trabajas en equipo bajo presión.',
      image: 'overcooked.jpg',
      category: 'Party Game',
      rating: 4.7,
      year: 2018,
      players: 'Hasta 4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=BKjyok9jHLk',
      developer: 'Ghost Town Games',
      platforms: ['Xbox', 'PlayStation', 'Nintendo Switch', 'PC'],
      price: 24.99,
      longDescription: 'Overcooked 2 lleva el caos culinario a nuevos niveles con cocinas dinámicas, nuevas recetas y la habilidad de lanzar ingredientes. Perfecta diversión para toda la familia.'
    },
    {
      id: 203,
      title: 'Cuphead',
      description: 'Run and gun clásico para 2 jugadores con arte inspirado en dibujos animados de los años 30. Enfrenta jefes épicos y desafiantes.',
      image: 'cuphead.jpg',
      category: 'Acción/Plataformas',
      rating: 4.8,
      year: 2017,
      players: '1-2 jugadores',
      trailer: 'https://www.youtube.com/watch?v=NN-9SQXoi50',
      developer: 'Studio MDHR',
      platforms: ['Xbox', 'PlayStation', 'Nintendo Switch', 'PC'],
      price: 19.99,
      longDescription: 'Cuphead es un clásico de acción enfocado en combates contra jefes. Inspirado en los dibujos animados de los años 1930, todo el arte es dibujado a mano, coloreado con acuarelas y con animaciones tradicionales.'
    },
    {
      id: 204,
      title: 'Minecraft',
      description: 'Construye, explora y sobrevive en mundos infinitos. Coopera con hasta 4 jugadores en pantalla dividida para crear aventuras épicas.',
      image: 'minecraft.jpeg',
      category: 'Sandbox/Aventura',
      rating: 4.8,
      year: 2011,
      players: 'Hasta 4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=MmB9b5njVbA',
      developer: 'Mojang Studios',
      platforms: ['Xbox', 'PlayStation', 'Nintendo Switch', 'PC'],
      price: 26.99,
      longDescription: 'Minecraft es el juego sandbox definitivo. Explora mundos generados aleatoriamente, construye estructuras increíbles, lucha contra criaturas y disfruta la creatividad sin límites con amigos.'
    },
    {
      id: 205,
      title: 'Rocket League',
      description: 'Fútbol con coches propulsados por cohetes. Compite en intensos partidos 2v2 o 3v3 en este híbrido deportivo de acción.',
      image: 'rocketleague.jpg',
      category: 'Deportes/Acción',
      rating: 4.6,
      year: 2015,
      players: 'Hasta 4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=Vawwy2FK28c',
      developer: 'Psyonix',
      platforms: ['Xbox', 'PlayStation', 'Nintendo Switch', 'PC'],
      price: 0,
      longDescription: 'Rocket League combina fútbol arcade con un caos vehicular a toda velocidad. Personaliza tu vehículo, domina los trucos aéreos y compite localmente con amigos.'
    }
  ];

  ngOnInit() {
    this.checkMousePosition();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.checkMousePosition(event);
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (!this.isOverCards) {
      this.scrollAccumulator = 0;
      return;
    }
    
    const section = this.elementRef.nativeElement.querySelector('.coop-section') as HTMLElement;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const isInViewport = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
    
    if (!isInViewport) {
      this.scrollAccumulator = 0;
      return;
    }

    const scrollingDown = event.deltaY > 0;
    const canChange = scrollingDown 
      ? this.currentCardIndex < this.coopGames.length - 1
      : this.currentCardIndex > 0;

    // Si no podemos cambiar en esta dirección, permitir scroll normal
    if (!canChange) {
      this.scrollAccumulator = 0;
      return;
    }

    // Prevenir scroll de la página mientras estamos sobre las cards
    event.preventDefault();

    // Si ya estamos cambiando, ignorar
    if (this.isScrolling) return;

    // Acumular scroll
    this.scrollAccumulator += Math.abs(event.deltaY);

    // Threshold dinámico: más sensible hacia arriba
    const threshold = scrollingDown ? this.SCROLL_THRESHOLD_DOWN : this.SCROLL_THRESHOLD_UP;

    // Cambiar card cuando alcanzamos el threshold
    if (this.scrollAccumulator >= threshold) {
      this.isScrolling = true;
      this.scrollAccumulator = 0;

      this.currentCardIndex += scrollingDown ? 1 : -1;
      this.updateProgress();

      setTimeout(() => {
        this.isScrolling = false;
      }, 1200);
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.checkMousePosition();
    this.checkViewportAndReset();
  }

  private checkViewportAndReset() {
    const section = this.elementRef.nativeElement.querySelector('.coop-section') as HTMLElement;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    // Si salimos del viewport, resetear al volver
    if (this.wasInViewport && !isInViewport) {
      this.currentCardIndex = 0;
      this.updateProgress();
    }

    this.wasInViewport = isInViewport;
  }

  private checkMousePosition(event?: MouseEvent) {
    const gamesStack = this.elementRef.nativeElement.querySelector('.games-stack') as HTMLElement;
    if (!gamesStack) {
      this.isOverCards = false;
      return;
    }

    const rect = gamesStack.getBoundingClientRect();
    
    if (event) {
      this.isOverCards = (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
    } else {
      const viewportHeight = window.innerHeight;
      this.isOverCards = rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.5;
    }
  }

  private updateProgress() {
    this.scrollProgress = (this.currentCardIndex / (this.coopGames.length - 1)) * 100;
  }

  getCardTransform(index: number): string {
    const offset = index - this.currentCardIndex;
    
    if (offset < 0) {
      return `translate(-50%, -50%) translateY(-150%) scale(0.8) rotateX(20deg)`;
    } else if (offset === 0) {
      return `translate(-50%, -50%) translateY(0) scale(1) rotateX(0deg)`;
    } else if (offset === 1) {
      return `translate(-50%, -50%) translateY(10%) scale(0.95) rotateX(-5deg)`;
    } else if (offset === 2) {
      return `translate(-50%, -50%) translateY(20%) scale(0.9) rotateX(-10deg)`;
    } else {
      return `translate(-50%, -50%) translateY(30%) scale(0.85) rotateX(-15deg)`;
    }
  }

  isCardVisible(index: number): boolean {
    const offset = index - this.currentCardIndex;
    return offset >= 0 && offset <= 2;
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  }

  openGameModal(game: Game) {
    this.modalService.openModal(game);
  }
}