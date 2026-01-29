import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsService, NewsArticle, NewsCategory } from './../services/news.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css'
})
export class Noticias implements OnInit {
  articles = signal<NewsArticle[]>([]);
  filteredArticles = signal<NewsArticle[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  selectedCategory = signal<NewsCategory>('xbox');
  searchQuery = signal('');

  categories: { id: NewsCategory; label: string; icon: string }[] = [
    { id: 'xbox', label: 'Xbox', icon: '🎮' },
    { id: 'all', label: 'Gaming', icon: '🕹️' },
    { id: 'playstation', label: 'PlayStation', icon: '🎯' },
    { id: 'nintendo', label: 'Nintendo', icon: '🔴' }
  ];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  // Cargar noticias
  loadNews(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.newsService.getNewsByCategory(this.selectedCategory()).subscribe({
      next: (articles) => {
        this.articles.set(articles);
        this.filteredArticles.set(articles);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  // Cambiar categoría
  selectCategory(category: NewsCategory): void {
    this.selectedCategory.set(category);
    this.searchQuery.set('');
    this.loadNews();
    this.scrollToTop();
  }

  // Buscar noticias
  onSearch(): void {
    const query = this.searchQuery().trim();
    
    if (!query) {
      this.filteredArticles.set(this.articles());
      return;
    }

    this.isLoading.set(true);
    this.newsService.searchNews(query).subscribe({
      next: (articles) => {
        this.filteredArticles.set(articles);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  // Limpiar búsqueda
  clearSearch(): void {
    this.searchQuery.set('');
    this.filteredArticles.set(this.articles());
  }

  // Formatear fecha
  formatDate(dateString: string): string {
    return this.newsService.formatDate(dateString);
  }

  // Obtener tiempo relativo (hace 2 horas, hace 1 día, etc.)
  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Hace menos de 1 hora';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    } else {
      return this.formatDate(dateString);
    }
  }

  // Scroll hacia arriba
  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Abrir noticia en nueva pestaña
  openArticle(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Reintentar carga
  retry(): void {
    this.loadNews();
  }
}
