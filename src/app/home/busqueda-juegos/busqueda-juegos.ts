import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Game } from '../../interfaces/game.interface';
import { GamesService } from '../../services/games.service';
import { GameModalService } from '../../services/game-modal.service';

@Component({
  selector: 'app-busqueda-juegos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './busqueda-juegos.html',
  styleUrl: './busqueda-juegos.css',
})
export class BusquedaJuegos implements OnInit {
  ASSETS_PATH = '/assets/images/';
  
  private gamesService = inject(GamesService);
  private modalService = inject(GameModalService);
  private activatedRoute = inject(ActivatedRoute);
  
  searchTerm = signal('');
  selectedCategories = signal<string[]>([]);
  searchResults = signal<Game[]>([]);
  allCategories = signal<string[]>([]);
  hasSearched = signal(false);
  
  ngOnInit() {
    this.allCategories.set(this.gamesService.getCategories());
    
    // Obtener parámetros de búsqueda desde URL
    this.activatedRoute.queryParams.subscribe(params => {
      // Si viene un ID de juego específico, filtrar por ese juego
      if (params['game']) {
        const gameId = parseInt(params['game'], 10);
        const game = this.gamesService.getGameById(gameId);
        if (game) {
          this.searchTerm.set(game.title);
          this.selectedCategories.set([game.category]);
          this.performSearch();
        }
      } 
      // Si viene un término de búsqueda general
      else if (params['q']) {
        this.searchTerm.set(params['q']);
        this.performSearch();
      }
    });
  }

  onSearch() {
    this.performSearch();
  }

  performSearch() {
    const term = this.searchTerm();
    const categories = this.selectedCategories();
    
    if (!term.trim() && categories.length === 0) {
      this.searchResults.set([]);
      this.hasSearched.set(false);
      return;
    }

    const results = this.gamesService.searchAndFilter(term, categories);
    this.searchResults.set(results);
    this.hasSearched.set(true);
  }

  onSearchInputChange() {
    // Búsqueda en tiempo real
    this.performSearch();
  }

  onCategoryChange(category: string) {
    const current = this.selectedCategories();
    const index = current.indexOf(category);
    
    if (index > -1) {
      // Remover categoría
      this.selectedCategories.set(current.filter((_, i) => i !== index));
    } else {
      // Agregar categoría
      this.selectedCategories.set([...current, category]);
    }
    
    // Re-ejecutar búsqueda en tiempo real
    this.performSearch();
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories().includes(category);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategories.set([]);
    this.searchResults.set([]);
    this.hasSearched.set(false);
  }

  openGameModal(game: Game) {
    this.modalService.openModal(game);
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  }

  getPriceDisplay(price: number | undefined): string {
    return (price ?? 0) === 0 ? 'Gratis' : `${(price ?? 0).toFixed(2)} €`;
  }
}
