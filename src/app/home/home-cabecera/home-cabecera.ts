import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string; // Ejemplo: 'images/neural-network.jpg'
  tech: string[];
}

@Component({
  selector: 'app-home-cabecera',
  standalone: true,
  imports: [CommonModule, RouterModule, NgFor],
  templateUrl: './home-cabecera.html',
  styleUrl: './home-cabecera.css',
})
export class HomeCabecera implements OnInit {
  // ✨ CORRECCIÓN: La propiedad es pública para ser accesible en el HTML
  ASSETS_PATH = 'assets/images/';

  currentIndex: number = 0; // Índice del ítem central del carrusel
  parallaxTransform: string = 'translateY(0)'; // Para el efecto parallax en la sección Hero

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // --- Datos del Carrusel ---
  carouselData: CarouselItem[] = [
    {
      id: 1,
      title: 'Crysis',
      description: 'Advanced AI system for predictive analytics.',
      image: 'crysis.png',
      tech: ['TensorFlow', 'Python'],
    },
    {
      id: 2,
      title: 'Assassins Creed',
      description: 'Next-generation cloud infrastructure.',
      image: 'assasins.png',
      tech: ['AWS', 'Kubernetes'],
    },
    {
      id: 3,
      title: 'Budokai',
      description: 'Secure decentralized storage solution.',
      image: 'budokaii.png',
      tech: ['Ethereum', 'Solidity'],
    },
    {
      id: 4,
      title: 'FIFA 08',
      description: 'Military-grade cybersecurity framework.',
      image: 'fifa08.png',
      tech: ['Zero Trust', 'AI Defense'],
    },
    {
      id: 5,
      title: 'GTA 5',
      description: 'Big data processing platform.',
      image: 'gta4.png',
      tech: ['Apache Spark', 'Kafka'],
    },
    {
      id: 6,
      title: 'Red Dead',
      description: 'Augmented reality system for data visualization.',
      image: 'reddead.png',
      tech: ['Unity', 'ARCore'],
    },
    {
      id: 7,
      title: 'Resident Evil 5',
      description: 'Intelligent IoT ecosystem with edge computing.',
      image: 'residentevil.png',
      tech: ['MQTT', 'Edge AI'],
    },
    {
      id: 8,
      title: 'Ufc 4',
      description: 'Fighting',
      image: 'ufc.png',
      tech: ['Unreal Engine', 'C++'],
    },
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

    // SSR-safe: Check if running in browser before accessing window
    const width = isPlatformBrowser(this.platformId) ? window.innerWidth : 1200; // Default fallback for SSR
    let spacing1, spacing2, spacing3;

    // Breakpoints más específicos para mejor responsive
    if (width <= 374) {
      // Extra small mobile
      spacing1 = 160;
      spacing2 = 220;
      spacing3 = 280;
    } else if (width <= 575) {
      // Mobile
      spacing1 = 180;
      spacing2 = 250;
      spacing3 = 320;
    } else if (width <= 767) {
      // Small tablet
      spacing1 = 200;
      spacing2 = 280;
      spacing3 = 360;
    } else if (width <= 991) {
      // Tablet
      spacing1 = 220;
      spacing2 = 310;
      spacing3 = 400;
    } else if (width <= 1199) {
      // Medium desktop
      spacing1 = 260;
      spacing2 = 380;
      spacing3 = 500;
    } else if (width <= 1399) {
      // Large desktop
      spacing1 = 320;
      spacing2 = 480;
      spacing3 = 620;
    } else {
      // Extra large desktop
      spacing1 = 360;
      spacing2 = 540;
      spacing3 = 720;
    }

    let transform: string;
    let opacity: number;
    let zIndex: number;
    let scale: number;
    let rotation: number;
    let translateZ: number;

    if (absOffset === 0) {
      // Elemento central (foco)
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

      rotation = isSmall ? 20 : isMedium ? 25 : 30;
      scale = isSmall ? 0.9 : isMedium ? 0.88 : 0.85;
      opacity = 0.8;
      zIndex = 5;
      translateZ = isSmall ? -150 : -200;
      let spacing = spacing1;

      if (absOffset === 2) {
        rotation = isSmall ? 30 : isMedium ? 35 : 40;
        scale = isSmall ? 0.8 : isMedium ? 0.75 : 0.7;
        opacity = 0.5;
        zIndex = 3;
        translateZ = isSmall ? -250 : -350;
        spacing = spacing2;
      } else if (absOffset === 3) {
        rotation = isSmall ? 35 : isMedium ? 40 : 45;
        scale = isSmall ? 0.7 : isMedium ? 0.65 : 0.6;
        opacity = 0.3;
        zIndex = 2;
        translateZ = isSmall ? -350 : -450;
        spacing = spacing3;
      }

      transform = `translate(-50%, -50%) translateX(${
        sign * spacing
      }px) translateZ(${translateZ}px) rotateY(${-sign * rotation}deg) scale(${scale})`;
      return { transform, opacity, 'z-index': zIndex };
    }

    // Elementos ocultos (detrás)
    opacity = 0;
    zIndex = 1;
    const hiddenScale = width <= 767 ? 0.4 : 0.5;
    const hiddenZ = width <= 767 ? -400 : -500;
    transform = `translate(-50%, -50%) translateX(${
      sign * spacing3
    }px) translateZ(${hiddenZ}px) rotateY(${-sign * 45}deg) scale(${hiddenScale})`;
    return { transform, opacity, 'z-index': zIndex };
  }
}
