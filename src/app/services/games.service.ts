import { Injectable } from '@angular/core';
import { Game } from '../interfaces/game.interface';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  
  private allGames: Game[] = [
    // GAMES EA
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
      trailer: 'https://www.youtube.com/watch?v=H2Y8XCe7F9E&pp=ygUkZGVlZCBmb3Igc3BlZWQgeGJveHMgc2VyaWVzIHggdHJhaWxlcg%3D%3D',
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
    },
    
    // HALO SAGA
    {
      id: 301,
      title: 'Halo: Combat Evolved',
      description: 'El juego que revolucionó los FPS en consolas. Descubre el anillo Halo y lucha contra el Covenant en esta obra maestra.',
      image: 'halo1.png',
      category: 'Acción',
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
      category: 'Acción',
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
      category: 'Acción',
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
      category: 'Acción',
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
      category: 'Acción',
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
      category: 'Acción',
      rating: 4.6,
      year: 2021,
      players: '1-4 jugadores',
      trailer: 'https://www.youtube.com/watch?v=PyMlV5_HRWk&pp=ygUWSGFsbyBJbmZpbml0ZSB0cmFpbGVyIA%3D%3D',
      developer: '343 Industries',
      platforms: ['Xbox Series X/S', 'Xbox One', 'PC'],
      price: 0,
      longDescription: 'Halo Infinite marca un nuevo comienzo para la franquicia con un mundo semi-abierto, multijugador free-to-play, y un regreso a las raíces que hicieron grande a la saga.'
    },

    // XBOX EXCLUSIVES
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
    },

    // LOCAL COOP GAMES
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

  constructor() {}

  /**
   * Obtiene todos los juegos
   */
  getAllGames(): Game[] {
    return [...this.allGames];
  }

  /**
   * Busca juegos por término (título o descripción)
   */
  searchGames(searchTerm: string): Game[] {
    if (!searchTerm.trim()) {
      return [];
    }

    const term = searchTerm.toLowerCase();
    return this.allGames.filter(game =>
      game.title.toLowerCase().includes(term) ||
      game.description.toLowerCase().includes(term) ||
      game.developer?.toLowerCase().includes(term) ||
      game.longDescription?.toLowerCase().includes(term)
    );
  }

  /**
   * Obtiene juegos por categoría
   */
  getGamesByCategory(category: string): Game[] {
    return this.allGames.filter(game => game.category === category);
  }

  /**
   * Obtiene todas las categorías únicas
   */
  getCategories(): string[] {
    const categories = new Set(this.allGames.map(game => game.category));
    return Array.from(categories).sort();
  }

  /**
   * Filtra juegos por múltiples categorías
   */
  getGamesByCategories(categories: string[]): Game[] {
    if (categories.length === 0) {
      return [];
    }
    return this.allGames.filter(game => categories.includes(game.category));
  }

  /**
   * Busca y filtra juegos simultáneamente con opciones avanzadas
   */
  searchAndFilter(searchTerm: string, categories: string[]): Game[] {
    let results = this.allGames;

    // Aplicar filtro de búsqueda si existe término
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(game =>
        game.title.toLowerCase().includes(term) ||
        game.description.toLowerCase().includes(term) ||
        game.category.toLowerCase().includes(term) ||
        game.developer?.toLowerCase().includes(term) ||
        game.longDescription?.toLowerCase().includes(term) ||
        game.platforms?.some(p => p.toLowerCase().includes(term))
      );
    }

    // Aplicar filtro de categorías
    if (categories.length > 0) {
      results = results.filter(game => categories.includes(game.category));
    }

    return results;
  }

  /**
   * Filtro avanzado por múltiples criterios
   */
  advancedFilter(options: {
    searchTerm?: string;
    categories?: string[];
    minRating?: number;
    maxPrice?: number;
    year?: number;
  }): Game[] {
    let results = this.allGames;

    // Filtrar por término de búsqueda
    if (options.searchTerm?.trim()) {
      const term = options.searchTerm.toLowerCase();
      results = results.filter(game =>
        game.title.toLowerCase().includes(term) ||
        game.description.toLowerCase().includes(term) ||
        game.category.toLowerCase().includes(term) ||
        game.developer?.toLowerCase().includes(term)
      );
    }

    // Filtrar por categorías
    if (options.categories && options.categories.length > 0) {
      results = results.filter(game => options.categories!.includes(game.category));
    }

    // Filtrar por rating
    if (options.minRating !== undefined) {
      results = results.filter(game => game.rating >= options.minRating!);
    }

    // Filtrar por precio máximo
    if (options.maxPrice !== undefined) {
      results = results.filter(game => (game.price ?? 0) <= options.maxPrice!);
    }

    // Filtrar por año
    if (options.year !== undefined) {
      results = results.filter(game => game.year === options.year);
    }

    return results;
  }

  /**
   * Obtiene juegos ordenados por rating
   */
  getTopRatedGames(limit: number = 5): Game[] {
    return [...this.allGames]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * Obtiene juegos gratis
   */
  getFreeGames(): Game[] {
    return this.allGames.filter(game => game.price === 0);
  }

  /**
   * Obtiene un juego por ID
   */
  getGameById(id: number): Game | undefined {
    return this.allGames.find(game => game.id === id);
  }
}
