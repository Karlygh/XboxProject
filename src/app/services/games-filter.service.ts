import { Injectable } from '@angular/core';
import { Game } from '../interfaces/game.interface';

/**
 * Servicio especializado en filtrado de juegos
 * Responsabilidad única: lógica de filtrado por categoría, rating, precio, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class GamesFilterService {

  constructor() {}

  /**
   * Obtiene todas las categorías únicas de un conjunto de juegos
   */
  getCategories(games: Game[]): string[] {
    const categories = new Set(games.map(game => game.category));
    return Array.from(categories).sort();
  }

  /**
   * Filtra juegos por una categoría específica
   */
  getGamesByCategory(games: Game[], category: string): Game[] {
    return games.filter(game => game.category === category);
  }

  /**
   * Filtra juegos por múltiples categorías
   */
  getGamesByCategories(games: Game[], categories: string[]): Game[] {
    if (categories.length === 0) {
      return [];
    }
    return games.filter(game => categories.includes(game.category));
  }

  /**
   * Filtro avanzado por múltiples criterios
   */
  advancedFilter(games: Game[], options: {
    categories?: string[];
    minRating?: number;
    maxPrice?: number;
    year?: number;
  }): Game[] {
    let results = games;

    // Filtrar por categorías
    if (options.categories && options.categories.length > 0) {
      results = results.filter(game => options.categories!.includes(game.category));
    }

    // Filtrar por rating mínimo
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
   * Obtiene juegos por rating
   */
  getTopRatedGames(games: Game[], limit: number = 5): Game[] {
    return [...games]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * Obtiene juegos gratis
   */
  getFreeGames(games: Game[]): Game[] {
    return games.filter(game => game.price === 0);
  }
}
