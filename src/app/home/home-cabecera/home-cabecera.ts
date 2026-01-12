import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Game } from '../../interfaces/game.interface';
import { GameModalService } from '../../services/game-modal.service';

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  gameData?: Game;
}

@Component({
  selector: 'app-home-cabecera',
  standalone: true,
  imports: [CommonModule, RouterModule, NgFor,],
  templateUrl: './home-cabecera.html',
  styleUrl: './home-cabecera.css',
})
export class HomeCabecera implements OnInit {
  ASSETS_PATH = 'assets/images/';
  private modalService = inject(GameModalService);
  
  currentIndex: number = 0;
  parallaxTransform: string = 'translateY(0)';
  
  carouselData: CarouselItem[] = [
    { 
      id: 1, 
      title: 'Crysis', 
      description: 'Advanced AI system for predictive analytics.', 
      image: 'crysis.png', 
      tech: ['TensorFlow', 'Python'],
      gameData: {
        id: 1,
        title: 'Crysis',
        description: 'Shooter de ciencia ficción con gráficos revolucionarios.',
        image: 'crysis.png',
        category: 'Acción',
        rating: 4.6,
        year: 2007,
        players: '1 jugador',
        trailer: 'https://www.youtube.com/watch?v=8PdGUZauShA',
        developer: 'Crytek',
        platforms: ['PC', 'Xbox 360', 'PlayStation 3'],
        price: 29.99,
        longDescription: 'Crysis es un shooter en primera persona que revolucionó los gráficos en videojuegos. Juega como Nomad, un soldado equipado con un nanotraje que te otorga habilidades sobrehumanas en una isla tropical llena de alienígenas.'
      }
    },
    { 
      id: 2, 
      title: 'Assassins Creed', 
      description: 'Next-generation cloud infrastructure.', 
      image: 'assasins.png', 
      tech: ['AWS', 'Kubernetes'],
      gameData: {
        id: 2,
        title: 'Assassin\'s Creed',
        description: 'Aventura histórica de acción y sigilo.',
        image: 'assasins.png',
        category: 'Aventura',
        rating: 4.7,
        year: 2007,
        players: '1 jugador',
        trailer: 'https://www.youtube.com/watch?v=RjQ6ZtyXoA0',
        developer: 'Ubisoft',
        platforms: ['PC', 'Xbox 360', 'PlayStation 3'],
        price: 39.99,
        longDescription: 'Vive la experiencia de Altaïr Ibn-La\'Ahad, un asesino durante las Cruzadas. Explora ciudades históricas, domina el arte del sigilo y descubre una conspiración que cambiará el curso de la historia.'
      }
    },
    { 
      id: 3, 
      title: 'Budokai', 
      description: 'Secure decentralized storage solution.', 
      image: 'budokaii.png', 
      tech: ['Ethereum', 'Solidity'],
      gameData: {
        id: 3,
        title: 'Dragon Ball Z: Budokai',
        description: 'Juego de lucha basado en el anime Dragon Ball Z.',
        image: 'budokaii.png',
        category: 'Lucha',
        rating: 4.4,
        year: 2002,
        players: '1-2 jugadores',
        trailer: 'https://www.youtube.com/watch?v=C4-C19Tac3Y',
        developer: 'Dimps',
        platforms: ['PlayStation 2', 'GameCube'],
        price: 19.99,
        longDescription: 'Revive las batallas más épicas de Dragon Ball Z. Juega con tus personajes favoritos como Goku, Vegeta, Gohan y muchos más en combates espectaculares con movimientos especiales fieles al anime.'
      }
    },
    { 
      id: 4, 
      title: 'FIFA 08', 
      description: 'Military-grade cybersecurity framework.', 
      image: 'fifa08.png', 
      tech: ['Zero Trust', 'AI Defense'],
      gameData: {
        id: 4,
        title: 'FIFA 08',
        description: 'Simulador de fútbol con licencias oficiales.',
        image: 'fifa08.png',
        category: 'Deportes',
        rating: 4.3,
        year: 2007,
        players: '1-4 jugadores',
        trailer: 'https://www.youtube.com/watch?v=fcpMI-AFj28&pp=ygUPZmlmYSAwOCB0cmFpbGVy0gcJCU0KAYcqIYzv',
        developer: 'EA Sports',
        platforms: ['PC', 'Xbox 360', 'PlayStation 3'],
        price: 24.99,
        longDescription: 'FIFA 08 introdujo el sistema Be a Pro, permitiendo controlar un solo jugador durante todo el partido. Disfruta de más de 30 ligas oficiales y 15,000 jugadores con licencias reales.'
      }
    },
    { 
      id: 5, 
      title: 'GTA 5', 
      description: 'Big data processing platform.', 
      image: 'gta4.png', 
      tech: ['Apache Spark', 'Kafka'],
      gameData: {
        id: 5,
        title: 'Grand Theft Auto V',
        description: 'Mundo abierto de crimen y acción.',
        image: 'gta4.png',
        category: 'Acción',
        rating: 4.8,
        year: 2013,
        players: '1-30 jugadores',
        trailer: 'https://www.youtube.com/watch?v=QkkoHAzjnUs&pp=ygUNZ3RhIDUgdHJhaWxlcg%3D%3D',
        developer: 'Rockstar Games',
        platforms: ['PC', 'Xbox', 'PlayStation'],
        price: 29.99,
        longDescription: 'GTA V ofrece la experiencia de mundo abierto más ambiciosa jamás creada. Juega como tres personajes únicos en Los Santos, una ciudad llena de oportunidades criminales y diversión sin límites.'
      }
    },
    { 
      id: 6, 
      title: 'Red Dead', 
      description: 'Augmented reality system for data visualization.', 
      image: 'reddead.png', 
      tech: ['Unity', 'ARCore'],
      gameData: {
        id: 6,
        title: 'Red Dead Redemption',
        description: 'Western épico en mundo abierto.',
        image: 'reddead.png',
        category: 'Aventura',
        rating: 4.9,
        year: 2010,
        players: '1-16 jugadores',
        trailer: 'https://www.youtube.com/watch?v=-8MN89fIaJ8&pp=ygUbcmVkIGRlYWQgcmVkZW1wdGlvbiB0cmFpbGVy',
        developer: 'Rockstar Games',
        platforms: ['Xbox 360', 'PlayStation 3'],
        price: 39.99,
        longDescription: 'Vive la historia de John Marston en el ocaso del Viejo Oeste. Un mundo abierto lleno de peligros, honor y redención en una de las mejores narrativas jamás contadas en un videojuego.'
      }
    },
    { 
      id: 7, 
      title: 'Resident Evil 5', 
      description: 'Intelligent IoT ecosystem with edge computing.', 
      image: 'residentevil.png', 
      tech: ['MQTT', 'Edge AI'],
      gameData: {
        id: 7,
        title: 'Resident Evil 5',
        description: 'Terror y supervivencia con cooperativo.',
        image: 'residentevil.png',
        category: 'Terror',
        rating: 4.2,
        year: 2009,
        players: '1-2 jugadores',
        trailer: 'https://www.youtube.com/watch?v=5lYNJQVz_Pc&pp=ygUXcmVzaWRlbnQgZXZpbCA1IHRyYWlsZXI%3D',
        developer: 'Capcom',
        platforms: ['PC', 'Xbox 360', 'PlayStation 3'],
        price: 19.99,
        longDescription: 'Chris Redfield y Sheva Alomar se enfrentan a una nueva amenaza biológica en África. Juega solo o en cooperativo en esta intensa aventura de supervivencia llena de acción y terror.'
      }
    },
    {
      id: 8, 
      title: 'UFC 4', 
      description: 'Fighting', 
      image: 'ufc.png', 
      tech: ['Unreal Engine', 'C++'],
      gameData: {
        id: 8,
        title: 'UFC 4',
        description: 'Simulador oficial de artes marciales mixtas.',
        image: 'ufc.png',
        category: 'Deportes',
        rating: 4.1,
        year: 2020,
        players: '1-2 jugadores',
        trailer: 'https://www.youtube.com/watch?v=5epQZVC6F3Y&pp=ygUMdWZjIDR0cmFpbGVy',
        developer: 'EA Sports',
        platforms: ['Xbox One', 'PlayStation 4'],
        price: 49.99,
        longDescription: 'UFC 4 ofrece la experiencia más auténtica de MMA con luchadores reales, movimientos fluidos y un sistema de combate revolucionario. Crea tu luchador y conquista el octágono.'
      }
    }
  ];

  get totalItems(): number {
    return this.carouselData.length;
  }

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  // --- Lógica de Scroll y Eventos de Ventana ---
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Parallax effect removed for static background
  }
  
  // --- Lógica de Navegación del Carrusel 3D ---

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalItems;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
  
  // Calcula los estilos de transformación (posición, rotación, escala) para cada ítem
  getCarouselItemStyles(index: number): any {
    const offset = index - this.currentIndex;
    const absOffset = Math.abs(offset);
    const sign = Math.sign(offset);

    const width = window.innerWidth;
    let spacing1, spacing2, spacing3;
    
    // Breakpoints más específicos para mejor responsive
    if (width <= 374) { // Extra small mobile
      spacing1 = 160; spacing2 = 220; spacing3 = 280;
    } else if (width <= 575) { // Mobile
      spacing1 = 180; spacing2 = 250; spacing3 = 320;
    } else if (width <= 767) { // Small tablet
      spacing1 = 200; spacing2 = 280; spacing3 = 360;
    } else if (width <= 991) { // Tablet
      spacing1 = 220; spacing2 = 310; spacing3 = 400;
    } else if (width <= 1199) { // Medium desktop
      spacing1 = 260; spacing2 = 380; spacing3 = 500;
    } else if (width <= 1399) { // Large desktop
      spacing1 = 320; spacing2 = 480; spacing3 = 620;
    } else { // Extra large desktop
      spacing1 = 360; spacing2 = 540; spacing3 = 720;
    }

    let transform: string;
    let opacity: number;
    let zIndex: number;
    let scale: number;
    let rotation: number;
    let translateZ: number;

    if (absOffset === 0) { // Elemento central (foco)
      opacity = 1;
      zIndex = 10;
      scale = 1;
      transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
      return { transform, opacity, 'z-index': zIndex };
    } 
    
    if (absOffset <= 3) { 
        // Ajustar rotación y escala según el tamaño de pantalla
        const isSmall = width <= 767;
        const isMedium = width <= 991;
        
        rotation = isSmall ? 20 : (isMedium ? 25 : 30);
        scale = isSmall ? 0.9 : (isMedium ? 0.88 : 0.85);
        opacity = 0.8;
        zIndex = 5;
        translateZ = isSmall ? -150 : -200;
        let spacing = spacing1;
        
        if (absOffset === 2) {
            rotation = isSmall ? 30 : (isMedium ? 35 : 40);
            scale = isSmall ? 0.8 : (isMedium ? 0.75 : 0.7);
            opacity = 0.5;
            zIndex = 3;
            translateZ = isSmall ? -250 : -350;
            spacing = spacing2;
        } else if (absOffset === 3) {
            rotation = isSmall ? 35 : (isMedium ? 40 : 45);
            scale = isSmall ? 0.7 : (isMedium ? 0.65 : 0.6);
            opacity = 0.3;
            zIndex = 2;
            translateZ = isSmall ? -350 : -450;
            spacing = spacing3;
        }

        transform = `translate(-50%, -50%) translateX(${sign * spacing}px) translateZ(${translateZ}px) rotateY(${-sign * rotation}deg) scale(${scale})`;
        return { transform, opacity, 'z-index': zIndex };
    }
    
    // Elementos ocultos (detrás)
    opacity = 0;
    zIndex = 1;
    const hiddenScale = width <= 767 ? 0.4 : 0.5;
    const hiddenZ = width <= 767 ? -400 : -500;
    transform = `translate(-50%, -50%) translateX(${sign * spacing3}px) translateZ(${hiddenZ}px) rotateY(${-sign * 45}deg) scale(${hiddenScale})`;
    return { transform, opacity, 'z-index': zIndex };
  }

  openGameModal(item: CarouselItem) {
    if (item.gameData) {
      this.modalService.openModal(item.gameData);
    }
  }
}