import { Injectable } from '@angular/core';
import { Game } from '../interfaces/game.interface';

/**
 * Servicio especializado en búsqueda de juegos
 * Responsabilidad única: lógica de búsqueda por término
 */
@Injectable({
  providedIn: 'root'
})
export class GamesSearchService {

  constructor() {}

  /**
   * Busca juegos por término (título, descripción, desarrollador)
   */
  searchGames(games: Game[], searchTerm: string): Game[] {
    if (!searchTerm.trim()) {
      return [];
    }

    const term = searchTerm.toLowerCase();
    return games.filter(game =>
      game.title.toLowerCase().includes(term) ||
      game.description.toLowerCase().includes(term) ||
      game.developer?.toLowerCase().includes(term) ||
      game.longDescription?.toLowerCase().includes(term)
    );
  }

  /**
   * Búsqueda avanzada con múltiples campos
   */
  advancedSearch(games: Game[], searchTerm: string): Game[] {
    if (!searchTerm.trim()) {
      return [];
    }

    const term = searchTerm.toLowerCase();
    return games.filter(game =>
      game.title.toLowerCase().includes(term) ||
      game.description.toLowerCase().includes(term) ||
      game.category.toLowerCase().includes(term) ||
      game.developer?.toLowerCase().includes(term) ||
      game.longDescription?.toLowerCase().includes(term) ||
      game.platforms?.some(p => p.toLowerCase().includes(term))
    );
  }
}
