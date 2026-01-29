import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, forkJoin, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface TriviaQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
  allAnswers: string[]; // Mezcladas
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  imageUrl?: string;
}

export interface GameStats {
  score: number;
  streak: number;
  bestStreak: number;
  totalGames: number;
  totalCorrect: number;
  totalWrong: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  private readonly TRIVIA_API = 'https://opentdb.com/api.php';
  private readonly RAWG_API = 'https://api.rawg.io/api';
  private readonly RAWG_KEY = ''; 
  private readonly TRANSLATE_API = 'https://libretranslate.com/translate';
  
  private readonly STORAGE_KEY = 'gaming_trivia_stats';
  private readonly LEADERBOARD_KEY = 'gaming_trivia_leaderboard';

  // Cache de traducciones para evitar peticiones repetidas
  private translationCache = new Map<string, string>();

  constructor(private http: HttpClient) {}

  // Obtener preguntas de trivia general de videojuegos
  getTriviaQuestions(amount: number = 10): Observable<TriviaQuestion[]> {
    const params = {
      amount: amount.toString(),
      category: '15', // Video Games category
      type: 'multiple'
    };

    return this.http.get<any>(`${this.TRIVIA_API}`, { params }).pipe(
      switchMap(async (response) => {
        if (!response.results) return [];

        // Traducir todas las preguntas en paralelo
        const translatedQuestions = await Promise.all(
          response.results.map(async (q: any, index: number) => {
            // Traducir pregunta
            const translatedQuestion = await this.translate(this.decodeHTML(q.question));
            
            // Traducir respuesta correcta
            const translatedCorrect = await this.translate(this.decodeHTML(q.correct_answer));
            
            // Traducir respuestas incorrectas
            const translatedWrong = await Promise.all(
              q.incorrect_answers.map((a: string) => this.translate(this.decodeHTML(a)))
            );

            // Mezclar respuestas
            const allAnswers = [...translatedWrong, translatedCorrect]
              .sort(() => Math.random() - 0.5);

            return {
              id: `trivia_${index}_${Date.now()}`,
              question: translatedQuestion,
              correctAnswer: translatedCorrect,
              wrongAnswers: translatedWrong,
              allAnswers: allAnswers,
              difficulty: q.difficulty,
              category: this.translateCategory(q.category)
            };
          })
        );

        return translatedQuestions;
      }),
      catchError(error => {
        console.error('Error fetching trivia:', error);
        return of([]);
      })
    );
  }

  // Obtener juegos aleatorios de RAWG para preguntas visuales
  getGameImageQuestions(amount: number = 5): Observable<TriviaQuestion[]> {
    return this.http.get<any>(`${this.RAWG_API}/games`, {
      params: {
        key: this.RAWG_KEY,
        platforms: '1,186,187', // Xbox platforms
        page_size: (amount * 4).toString(),
        ordering: '-rating'
      }
    }).pipe(
      map(response => {
        if (!response.results || response.results.length < amount) {
          return [];
        }

        const games = response.results.slice(0, amount);
        const allGames = response.results;

        return games.map((game: any, index: number) => {
          const wrongGames = allGames
            .filter((g: any) => g.id !== game.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

          const wrongAnswers = wrongGames.map((g: any) => g.name);
          const allAnswers = [...wrongAnswers, game.name]
            .sort(() => Math.random() - 0.5);

          return {
            id: `game_${game.id}_${Date.now()}`,
            question: '¿Qué juego es este?',
            correctAnswer: game.name,
            wrongAnswers,
            allAnswers,
            difficulty: 'medium' as const,
            category: 'Reconocimiento Visual',
            imageUrl: game.background_image
          };
        });
      }),
      catchError(error => {
        console.error('Error fetching game images:', error);
        return of([]);
      })
    );
  }

  // Obtener preguntas de año de lanzamiento
  getYearQuestions(amount: number = 5): Observable<TriviaQuestion[]> {
    return this.http.get<any>(`${this.RAWG_API}/games`, {
      params: {
        key: this.RAWG_KEY,
        platforms: '1,186,187',
        page_size: amount.toString(),
        ordering: '-added'
      }
    }).pipe(
      map(response => {
        if (!response.results) return [];

        return response.results.map((game: any) => {
          const correctYear = new Date(game.released).getFullYear();
          const wrongYears = this.generateWrongYears(correctYear);
          const allAnswers = [correctYear.toString(), ...wrongYears]
            .sort(() => Math.random() - 0.5);

          return {
            id: `year_${game.id}_${Date.now()}`,
            question: `¿En qué año se lanzó "${game.name}"?`,
            correctAnswer: correctYear.toString(),
            wrongAnswers: wrongYears,
            allAnswers,
            difficulty: 'hard' as const,
            category: 'Fechas de Lanzamiento',
            imageUrl: game.background_image
          };
        });
      }),
      catchError(error => {
        console.error('Error fetching year questions:', error);
        return of([]);
      })
    );
  }

  // Traducir texto usando LibreTranslate
  private async translate(text: string): Promise<string> {
    // Verificar cache primero
    if (this.translationCache.has(text)) {
      return this.translationCache.get(text)!;
    }

    // Si el texto es muy corto o es un número, no traducir
    if (text.length < 3 || /^\d+$/.test(text)) {
      return text;
    }

    try {
      const response = await fetch(this.TRANSLATE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'es',
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      const translated = data.translatedText || text;

      // Guardar en cache
      this.translationCache.set(text, translated);

      return translated;
    } catch (error) {
      console.warn('Translation error, using original text:', error);
      // Si falla la traducción, devolver texto original
      return text;
    }
  }

  // Traducir categoría
  private translateCategory(category: string): string {
    const categories: Record<string, string> = {
      'Entertainment: Video Games': 'Videojuegos',
      'Video Games': 'Videojuegos',
      'Science & Nature': 'Ciencia y Naturaleza',
      'Sports': 'Deportes',
      'History': 'Historia',
      'Geography': 'Geografía',
      'Art': 'Arte',
      'Music': 'Música',
      'Film': 'Cine',
      'Television': 'Televisión',
      'General Knowledge': 'Conocimiento General'
    };
    
    return categories[category] || 'Entretenimiento';
  }

  // Generar años incorrectos cercanos al correcto
  private generateWrongYears(correctYear: number): string[] {
    const years = new Set<string>();
    while (years.size < 3) {
      const offset = Math.floor(Math.random() * 6) - 3; // -3 a +3
      const wrongYear = correctYear + offset;
      if (wrongYear !== correctYear && wrongYear > 2000 && wrongYear <= 2024) {
        years.add(wrongYear.toString());
      }
    }
    return Array.from(years);
  }

  // Decodificar entidades HTML
  private decodeHTML(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  // Guardar estadísticas en localStorage
  saveStats(stats: GameStats): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  }

  // Cargar estadísticas desde localStorage
  loadStats(): GameStats {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getDefaultStats();
  }

  // Estadísticas por defecto
  private getDefaultStats(): GameStats {
    return {
      score: 0,
      streak: 0,
      bestStreak: 0,
      totalGames: 0,
      totalCorrect: 0,
      totalWrong: 0,
      achievements: this.getDefaultAchievements()
    };
  }

  // Logros disponibles
  private getDefaultAchievements(): Achievement[] {
    return [
      {
        id: 'first_win',
        title: 'Primera Victoria',
        description: 'Responde tu primera pregunta correctamente',
        icon: '🎯',
        unlocked: false
      },
      {
        id: 'streak_5',
        title: 'Racha de Fuego',
        description: 'Consigue una racha de 5 respuestas correctas',
        icon: '🔥',
        unlocked: false
      },
      {
        id: 'streak_10',
        title: 'Imparable',
        description: 'Consigue una racha de 10 respuestas correctas',
        icon: '⚡',
        unlocked: false
      },
      {
        id: 'games_10',
        title: 'Jugador Dedicado',
        description: 'Completa 10 partidas',
        icon: '🎮',
        unlocked: false
      },
      {
        id: 'games_50',
        title: 'Veterano',
        description: 'Completa 50 partidas',
        icon: '🏆',
        unlocked: false
      },
      {
        id: 'perfect_game',
        title: 'Perfección',
        description: 'Completa una partida sin errores',
        icon: '👑',
        unlocked: false
      },
      {
        id: 'score_100',
        title: 'Centurión',
        description: 'Alcanza 100 puntos en una partida',
        icon: '💯',
        unlocked: false
      },
      {
        id: 'correct_100',
        title: 'Maestro del Trivia',
        description: 'Responde 100 preguntas correctamente',
        icon: '🧠',
        unlocked: false
      }
    ];
  }

  // Verificar y desbloquear logros
  checkAchievements(stats: GameStats): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    stats.achievements.forEach(achievement => {
      if (!achievement.unlocked) {
        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first_win':
            shouldUnlock = stats.totalCorrect >= 1;
            break;
          case 'streak_5':
            shouldUnlock = stats.bestStreak >= 5;
            break;
          case 'streak_10':
            shouldUnlock = stats.bestStreak >= 10;
            break;
          case 'games_10':
            shouldUnlock = stats.totalGames >= 10;
            break;
          case 'games_50':
            shouldUnlock = stats.totalGames >= 50;
            break;
          case 'perfect_game':
            // Se verifica externamente cuando termina el juego
            break;
          case 'score_100':
            // Se verifica externamente cuando termina el juego
            break;
          case 'correct_100':
            shouldUnlock = stats.totalCorrect >= 100;
            break;
        }

        if (shouldUnlock) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          newlyUnlocked.push(achievement);
        }
      }
    });

    return newlyUnlocked;
  }

  // Guardar entrada en leaderboard
  saveToLeaderboard(name: string, score: number): void {
    const leaderboard = this.getLeaderboard();
    leaderboard.push({ name, score, date: new Date() });
    leaderboard.sort((a, b) => b.score - a.score);
    const top10 = leaderboard.slice(0, 10);
    localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(top10));
  }

  // Obtener leaderboard
  getLeaderboard(): LeaderboardEntry[] {
    const stored = localStorage.getItem(this.LEADERBOARD_KEY);
    if (stored) {
      return JSON.parse(stored).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
    }
    return [];
  }
}