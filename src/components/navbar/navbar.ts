import { Component, inject, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GamesService } from '../../app/services/games.service';
import { Game } from '../../app/interfaces/game.interface';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements AfterViewInit {
  @ViewChild('searchInput') searchInput?: ElementRef;
  @ViewChild('dropdownContainer') dropdownContainer?: ElementRef;

  private router = inject(Router);
  private gamesService = inject(GamesService);
  
  searchQuery = signal('');
  showDropdown = signal(false);
  filteredGames = signal<Game[]>([]);
  dropdownPosition = signal({ top: '0px', left: '0px', width: '0px' });

  ngAfterViewInit() {
    this.updateDropdownPosition();
    window.addEventListener('resize', () => this.updateDropdownPosition());
  }

  filterGames() {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (query.length === 0) {
      this.filteredGames.set([]);
      this.showDropdown.set(false);
      return;
    }

    const games = this.gamesService.getAllGames();
    const filtered = games.filter(game =>
      game.title.toLowerCase().includes(query) ||
      game.category.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query)
    );

    this.filteredGames.set(filtered);
    this.showDropdown.set(filtered.length > 0);
    
    if (filtered.length > 0) {
      setTimeout(() => this.updateDropdownPosition(), 0);
    }
  }

  updateDropdownPosition() {
    if (!this.searchInput) return;
    
    const inputElement = this.searchInput.nativeElement;
    const rect = inputElement.getBoundingClientRect();
    
    // Calcular posición del dropdown
    const top = rect.bottom + 8; // 8px de margen
    const left = rect.left;
    const width = rect.width;
    
    this.dropdownPosition.set({
      top: `${top}px`,
      left: `${left}px`,
      width: `${Math.max(width, 280)}px`
    });
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.filterGames();
  }

  onGameSelect(game: Game) {
    this.searchQuery.set(game.title);
    this.showDropdown.set(false);
    this.filteredGames.set([]);
    this.router.navigate(['/buscar'], { queryParams: { game: game.id, category: game.category } });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();
    
    if (query) {
      this.searchQuery.set(query);
      this.showDropdown.set(false);
      this.router.navigate(['/buscar'], { queryParams: { q: query } });
    }
  }

  onSearchButtonClick() {
    const query = this.searchQuery().trim();
    if (query) {
      this.showDropdown.set(false);
      this.router.navigate(['/buscar'], { queryParams: { q: query } });
    }
  }

  onBlur() {
    // Cierra el dropdown después de un pequeño delay para permitir clicks
    setTimeout(() => {
      this.showDropdown.set(false);
    }, 200);
  }
}
