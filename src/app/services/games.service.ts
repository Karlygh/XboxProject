import { Injectable } from '@angular/core';
import { Game } from '../interfaces/game.interface';
import { ALL_GAMES, EA_GAMES, HALO_GAMES, XBOX_EXCLUSIVES, COOP_GAMES } from '../data/games.data';
import { GamesSearchService } from './games-search.service';
import { GamesFilterService } from './games-filter.service';

/**
 * Servicio de coordinación para juegos
 * Responsabilidad única: orquestar operaciones usando servicios especializados
 * 
 * Servicios especializados:
 * - GamesSearchService: búsqueda por término
 * - GamesFilterService: filtrado por criterios
 */
@Injectable({
  providedIn: 'root'
})
export class GamesService {
  
  /**
   * Datos centralizados importados desde games.data.ts
   * ÚNICA fuente de verdad para los datos de juegos
   */
  private allGames: Game[] = ALL_GAMES;

  constructor(
    private searchService: GamesSearchService,
    private filterService: GamesFilterService
  ) {}

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
   * Busca juegos por término (delega a GamesSearchService)
   */
  searchGames(searchTerm: string): Game[] {
    return this.searchService.searchGames(this.allGames, searchTerm);
  }

  /**
   * Obtiene juegos por categoría (delega a GamesFilterService)
   */
  getGamesByCategory(category: string): Game[] {
    return this.filterService.getGamesByCategory(this.allGames, category);
  }

  /**
   * Obtiene todas las categorías únicas (delega a GamesFilterService)
   */
  getCategories(): string[] {
    return this.filterService.getCategories(this.allGames);
  }

  /**
   * Filtra juegos por múltiples categorías (delega a GamesFilterService)
   */
  getGamesByCategories(categories: string[]): Game[] {
    return this.filterService.getGamesByCategories(this.allGames, categories);
  }

  /**
   * Busca y filtra juegos simultáneamente (coordina ambos servicios)
   */
  searchAndFilter(searchTerm: string, categories: string[]): Game[] {
    let results = this.allGames;

    // Aplicar búsqueda si existe término
    if (searchTerm.trim()) {
      results = this.searchService.advancedSearch(results, searchTerm);
    }

    // Aplicar filtro de categorías
    if (categories.length > 0) {
      results = this.filterService.getGamesByCategories(results, categories);
    }

    return results;
  }

  /**
   * Filtro avanzado por múltiples criterios (delega a GamesFilterService)
   */
  advancedFilter(options: {
    searchTerm?: string;
    categories?: string[];
    minRating?: number;
    maxPrice?: number;
    year?: number;
  }): Game[] {
    let results = this.allGames;

    // Aplicar búsqueda si existe término
    if (options.searchTerm?.trim()) {
      results = this.searchService.advancedSearch(results, options.searchTerm);
    }

    // Aplicar filtros adicionales
    results = this.filterService.advancedFilter(results, {
      categories: options.categories,
      minRating: options.minRating,
      maxPrice: options.maxPrice,
      year: options.year
    });

    return results;
  }

  /**
   * Obtiene juegos ordenados por rating (delega a GamesFilterService)
   */
  getTopRatedGames(limit: number = 5): Game[] {
    return this.filterService.getTopRatedGames(this.allGames, limit);
  }

  /**
   * Obtiene juegos gratis (delega a GamesFilterService)
   */
  getFreeGames(): Game[] {
    return this.filterService.getFreeGames(this.allGames);
  }

  /**
   * Obtiene un juego por ID
   */
  getGameById(id: number): Game | undefined {
    return this.allGames.find(game => game.id === id);
  }
}
