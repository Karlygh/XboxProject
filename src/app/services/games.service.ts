import { Injectable } from '@angular/core';
import { Game } from '../interfaces/game.interface';
import { ALL_GAMES, EA_GAMES, HALO_GAMES, XBOX_EXCLUSIVES, COOP_GAMES } from '../data/games.data';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  
  /**
   * Datos centralizados importados desde games.data.ts
   * ÚNICA fuente de verdad para los datos de juegos
   */
  private allGames: Game[] = ALL_GAMES;

  constructor() {}

  /**
   * Obtiene juegos EA Sports
   */
  getEAGames(): Game[] {
    return [...EA_GAMES];
  }

  /**
   * Obtiene la saga Halo completa
   */
  getHaloGames(): Game[] {
    return [...HALO_GAMES];
  }

  /**
   * Obtiene exclusivos de Xbox
   */
  getXboxExclusives(): Game[] {
    return [...XBOX_EXCLUSIVES];
  }

  /**
   * Obtiene juegos coop locales
   */
  getCoopGames(): Game[] {
    return [...COOP_GAMES];
  }

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
