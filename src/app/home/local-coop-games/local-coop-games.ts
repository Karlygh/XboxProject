import { Component, OnInit, inject } from '@angular/core';
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
  
  currentCardIndex = 0;
  rotation = 0;
  private isRotating = false;

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