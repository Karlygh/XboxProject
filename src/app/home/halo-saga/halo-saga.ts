import { Component, HostListener, OnInit, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../interfaces/game.interface';
import { GameModalService } from '../../services/game-modal.service';

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
  private elementRef = inject(ElementRef);
  
  hasAnimated = false;
  activeCardIndex = -1;
  isInHaloSection = false;

  // Datos de la saga Halo
  sagaTitle = 'HALO';
  sagaSubtitle = 'La saga legendaria que definió una generación';
  
  haloGames: Game[] = [
    {
      id: 301,
      title: 'Halo: Combat Evolved',
      description: 'El juego que revolucionó los FPS en consolas. Descubre el anillo Halo y lucha contra el Covenant en esta obra maestra.',
      image: 'halo1.png',
      category: 'El Origen',
      rating: 4.8,
      year: 2001,
      players: '1-4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=v0kHiEME0Vk&pp=ygUdSGFsbzogQ29tYmF0IEV2b2x2ZWQgdHJhaWxlciA%3D',
      developer: 'Bungie',
      platforms: ['Xbox', 'PC'],
      price: 9.99,
      longDescription: 'Halo: Combat Evolved cambió para siempre los shooters en consola. Con su narrativa épica, combate revolucionario y el icónico Master Chief, estableció las bases de una de las franquicias más importantes de la historia.'
    },
    {
      id: 302,
      title: 'Halo 2',
      description: 'La batalla continúa en la Tierra y más allá. Juega como el Master Chief y el Arbiter en esta secuela revolucionaria.',
      image: 'halo2.png',
      category: 'La Expansión',
      rating: 4.9,
      year: 2004,
      players: '1-4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=wtA1pqbHTeM&pp=ygUPaGFsbyAyIHRyYWlsZXIg',
      developer: 'Bungie',
      platforms: ['Xbox', 'PC'],
      price: 9.99,
      longDescription: 'Halo 2 elevó todo lo que hizo grande al original. Con una narrativa más compleja, el multijugador en línea de Xbox Live, y gráficos mejorados, se convirtió en un fenómeno cultural.'
    },
    {
      id: 303,
      title: 'Halo 3',
      description: 'El épico final de la trilogía original. Termina la lucha y descubre el destino de la humanidad en la batalla más grande jamás vista.',
      image: 'halo3.jpg',
      category: 'El Clímax',
      rating: 4.9,
      year: 2007,
      players: '1-4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=T9Ezd2FqxAU&pp=ygUPaGFsbyAzIHRyYWlsZXIg',
      developer: 'Bungie',
      platforms: ['Xbox 360', 'PC'],
      price: 9.99,
      longDescription: 'Halo 3 concluyó la trilogía original de manera magistral. Con el mejor multijugador de la serie, Forge mode revolucionario, y una campaña épica, se convirtió en el juego más vendido de 2007.'
    },
    {
      id: 304,
      title: 'Halo: Reach',
      description: 'Conoce la historia de Noble Team. Vive los últimos días del planeta Reach en la precuela más emotiva de la saga.',
      image: 'halo4.jpg',
      category: 'La Precuela',
      rating: 4.8,
      year: 2010,
      players: '1-4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=18-_9E0HNY4&pp=ygUUSGFsbzogUmVhY2ggdHJhaWxlciA%3D',
      developer: 'Bungie',
      platforms: ['Xbox 360', 'PC'],
      price: 9.99,
      longDescription: 'Halo: Reach narra la trágica caída del planeta Reach. Como miembro del Noble Team, vivirás una historia emotiva y devastadora que precede a los eventos de Combat Evolved.'
    },
    {
      id: 305,
      title: 'Halo 4',
      description: 'El Master Chief regresa. Nueva trilogía, nuevos enemigos, y el despertar de una antigua amenaza que cambiará todo.',
      image: 'halo5.jpg',
      category: 'Nueva Era',
      rating: 4.7,
      year: 2012,
      players: '1-4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=ulLDTPJ_sWo&list=RDulLDTPJ_sWo&start_radio=1&pp=ygUOaGFsbyA0dHJhaWxlciCgBwE%3D',
      developer: '343 Industries',
      platforms: ['Xbox 360', 'Xbox One', 'PC'],
      price: 9.99,
      longDescription: '343 Industries toma las riendas de Halo con una nueva trilogía. El Master Chief se enfrenta a los Prometeos y explora la relación con Cortana en esta nueva era de la franquicia.'
    },
    {
      id: 306,
      title: 'Halo Infinite',
      description: 'El futuro de Halo. Explora un anillo Halo abierto, enfrenta a los Desterrados y salva a la humanidad una vez más.',
      image: 'halo6.jpg',
      category: 'El Futuro',
      rating: 4.6,
      year: 2021,
      players: '1-4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=PyMlV5_HRWk&pp=ygUWSGFsbyBJbmZpbml0ZSB0cmFpbGVyIA%3D%3D',
      developer: '343 Industries',
      platforms: ['Xbox Series X/S', 'Xbox One', 'PC'],
      price: 0,
      longDescription: 'Halo Infinite marca un nuevo comienzo para la franquicia con un mundo semi-abierto, multijugador free-to-play, y un regreso a las raíces que hicieron grande a la saga.'
    }
  ];

  ngOnInit() {
    this.checkIfInViewport();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.checkIfInViewport();
  }

  private checkIfInViewport() {
    const section = this.elementRef.nativeElement.querySelector('.saga-section') as HTMLElement;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Verificar si estamos en la sección de Halo
    this.isInHaloSection = rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2;
    
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