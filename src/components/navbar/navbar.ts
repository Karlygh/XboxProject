import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  searchQuery = signal('');

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();
    
    if (query) {
      this.searchQuery.set(query);
      this.router.navigate(['/buscar'], { queryParams: { q: query } });
    }
  }

  onSearchButtonClick() {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/buscar'], { queryParams: { q: query } });
    }
  }
}
