import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export type NewsCategory = 'all' | 'xbox' | 'playstation' | 'nintendo' | 'gaming';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly API_KEY = '94c26b2dc2b74b3780c980012511fdda'; 
  private readonly BASE_URL = 'https://newsapi.org/v2';

  constructor(private http: HttpClient) {}

  // Obtener noticias de Xbox
  getXboxNews(pageSize: number = 12): Observable<NewsArticle[]> {
    const params = {
      apiKey: this.API_KEY,
      q: 'Xbox OR "Microsoft Gaming" OR "Xbox Series" OR "Game Pass"',
      language: 'es',
      sortBy: 'publishedAt',
      pageSize: pageSize.toString()
    };

    return this.http.get<NewsResponse>(`${this.BASE_URL}/everything`, { params })
      .pipe(
        map(response => response.articles.filter(article => 
          article.urlToImage && article.description
        )),
        catchError(this.handleError)
      );
  }

  // Obtener noticias por categoría
  getNewsByCategory(category: NewsCategory, pageSize: number = 12): Observable<NewsArticle[]> {
    const queries: Record<NewsCategory, string> = {
      all: 'videogames OR gaming OR esports',
      xbox: 'Xbox OR "Microsoft Gaming" OR "Game Pass"',
      playstation: 'PlayStation OR PS5',
      nintendo: 'Nintendo OR Switch',
      gaming: 'videogames OR gaming industry'
    };

    const params = {
      apiKey: this.API_KEY,
      q: queries[category],
      language: 'es',
      sortBy: 'publishedAt',
      pageSize: pageSize.toString()
    };

    return this.http.get<NewsResponse>(`${this.BASE_URL}/everything`, { params })
      .pipe(
        map(response => response.articles.filter(article => 
          article.urlToImage && article.description
        )),
        catchError(this.handleError)
      );
  }

  // Buscar noticias específicas
  searchNews(query: string, pageSize: number = 12): Observable<NewsArticle[]> {
    const params = {
      apiKey: this.API_KEY,
      q: query,
      language: 'es',
      sortBy: 'publishedAt',
      pageSize: pageSize.toString()
    };

    return this.http.get<NewsResponse>(`${this.BASE_URL}/everything`, { params })
      .pipe(
        map(response => response.articles.filter(article => 
          article.urlToImage && article.description
        )),
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error al cargar las noticias';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Formatear fecha a español
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  }
}