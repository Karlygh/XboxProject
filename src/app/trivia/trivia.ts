import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TriviaService, TriviaQuestion, GameStats, Achievement } from './../services/trivia.service';

type GameMode = 'menu' | 'playing' | 'result' | 'leaderboard' | 'achievements';
type QuestionType = 'general' | 'images' | 'years' | 'mixed';

@Component({
  selector: 'app-trivia',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './trivia.html',
  styleUrl: './trivia.css'
})
export class Trivia implements OnInit {
  // Estados del juego
  gameMode = signal<GameMode>('menu');
  questions = signal<TriviaQuestion[]>([]);
  currentQuestionIndex = signal(0);
  selectedAnswer = signal<string | null>(null);
  isAnswerChecked = signal(false);
  isCorrect = signal(false);
  
  // Estadísticas de la partida actual
  currentScore = signal(0);
  currentStreak = signal(0);
  correctAnswers = signal(0);
  wrongAnswers = signal(0);
  
  // Estadísticas globales
  stats = signal<GameStats | null>(null);
  
  // Logros desbloqueados en esta sesión
  newAchievements = signal<Achievement[]>([]);
  showAchievementPopup = signal(false);
  
  // Configuración
  questionType = signal<QuestionType>('mixed');
  questionAmount = signal(10);
  
  // Loading
  isLoading = signal(false);
  
  // Leaderboard
  playerName = signal('');
  showNameInput = signal(false);
  
  // Temporizador (opcional)
  timeLeft = signal(15);
  timerInterval: any;
  
  // Exponer Math para el template
  readonly Math = Math;
  
  // Computed
  currentQuestion = computed(() => {
    const questions = this.questions();
    const index = this.currentQuestionIndex();
    return questions[index] || null;
  });
  
  progress = computed(() => {
    const total = this.questions().length;
    const current = this.currentQuestionIndex() + 1;
    return total > 0 ? (current / total) * 100 : 0;
  });

  constructor(private triviaService: TriviaService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  // Cargar estadísticas
  loadStats(): void {
    this.stats.set(this.triviaService.loadStats());
  }

  // Iniciar juego
  async startGame(): Promise<void> {
    this.isLoading.set(true);
    this.resetGameState();
    
    try {
      let questions: TriviaQuestion[] = [];
      const type = this.questionType();
      const amount = this.questionAmount();

      if (type === 'general') {
        questions = await this.triviaService.getTriviaQuestions(amount).toPromise() || [];
      } else if (type === 'images') {
        questions = await this.triviaService.getGameImageQuestions(amount).toPromise() || [];
      } else if (type === 'years') {
        questions = await this.triviaService.getYearQuestions(amount).toPromise() || [];
      } else if (type === 'mixed') {
        const [general, images, years] = await Promise.all([
          this.triviaService.getTriviaQuestions(Math.floor(amount / 3)).toPromise(),
          this.triviaService.getGameImageQuestions(Math.floor(amount / 3)).toPromise(),
          this.triviaService.getYearQuestions(Math.ceil(amount / 3)).toPromise()
        ]);
        questions = [...(general || []), ...(images || []), ...(years || [])]
          .sort(() => Math.random() - 0.5)
          .slice(0, amount);
      }

      if (questions.length === 0) {
        alert('Error al cargar preguntas. Por favor, intenta de nuevo.');
        this.gameMode.set('menu');
        return;
      }

      this.questions.set(questions);
      this.gameMode.set('playing');
      this.startTimer();
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Error al cargar preguntas. Por favor, intenta de nuevo.');
      this.gameMode.set('menu');
    } finally {
      this.isLoading.set(false);
    }
  }

  // Resetear estado del juego
  resetGameState(): void {
    this.currentQuestionIndex.set(0);
    this.selectedAnswer.set(null);
    this.isAnswerChecked.set(false);
    this.isCorrect.set(false);
    this.currentScore.set(0);
    this.currentStreak.set(0);
    this.correctAnswers.set(0);
    this.wrongAnswers.set(0);
    this.questions.set([]);
    this.stopTimer();
  }

  // Seleccionar respuesta
  selectAnswer(answer: string): void {
    if (this.isAnswerChecked()) return;
    this.selectedAnswer.set(answer);
  }

  // Verificar respuesta
  checkAnswer(): void {
    if (!this.selectedAnswer() || this.isAnswerChecked()) return;

    const question = this.currentQuestion();
    if (!question) return;

    const correct = this.selectedAnswer() === question.correctAnswer;
    this.isCorrect.set(correct);
    this.isAnswerChecked.set(true);
    this.stopTimer();

    if (correct) {
      // Calcular puntos (base + bonus por racha + bonus por tiempo)
      const basePoints = 10;
      const streakBonus = this.currentStreak() * 2;
      const timeBonus = Math.floor(this.timeLeft() / 3);
      const totalPoints = basePoints + streakBonus + timeBonus;

      this.currentScore.update(score => score + totalPoints);
      this.currentStreak.update(streak => streak + 1);
      this.correctAnswers.update(n => n + 1);
    } else {
      this.currentStreak.set(0);
      this.wrongAnswers.update(n => n + 1);
    }
  }

  // Siguiente pregunta
  nextQuestion(): void {
    const nextIndex = this.currentQuestionIndex() + 1;
    
    if (nextIndex < this.questions().length) {
      this.currentQuestionIndex.set(nextIndex);
      this.selectedAnswer.set(null);
      this.isAnswerChecked.set(false);
      this.isCorrect.set(false);
      this.timeLeft.set(15);
      this.startTimer();
    } else {
      this.endGame();
    }
  }

  // Finalizar juego
  endGame(): void {
    this.stopTimer();
    this.updateStats();
    this.gameMode.set('result');
    
    // Verificar si califica para leaderboard (top 10)
    const leaderboard = this.triviaService.getLeaderboard();
    const wouldQualify = leaderboard.length < 10 || 
                         this.currentScore() > leaderboard[leaderboard.length - 1]?.score;
    
    if (wouldQualify) {
      this.showNameInput.set(true);
    }
  }

  // Actualizar estadísticas globales
  updateStats(): void {
    const currentStats = this.stats();
    if (!currentStats) return;
    const isPerfectGame = this.wrongAnswers() === 0 && this.correctAnswers() > 0;

    const updatedStats: GameStats = {
      ...currentStats,
      score: currentStats.score + this.currentScore(),
      streak: this.currentStreak(),
      bestStreak: Math.max(currentStats.bestStreak, this.currentStreak()),
      totalGames: currentStats.totalGames + 1,
      totalCorrect: currentStats.totalCorrect + this.correctAnswers(),
      totalWrong: currentStats.totalWrong + this.wrongAnswers(),
      achievements: currentStats.achievements
    };

    // Desbloquear logros especiales
    if (isPerfectGame) {
      const perfectAchievement = updatedStats.achievements.find(a => a.id === 'perfect_game');
      if (perfectAchievement && !perfectAchievement.unlocked) {
        perfectAchievement.unlocked = true;
        perfectAchievement.unlockedAt = new Date();
      }
    }

    if (this.currentScore() >= 100) {
      const score100Achievement = updatedStats.achievements.find(a => a.id === 'score_100');
      if (score100Achievement && !score100Achievement.unlocked) {
        score100Achievement.unlocked = true;
        score100Achievement.unlockedAt = new Date();
      }
    }

    // Verificar otros logros
    const newAchievements = this.triviaService.checkAchievements(updatedStats);

    if (newAchievements.length > 0) {
      this.newAchievements.set(newAchievements);
      this.showAchievementPopup.set(true);

      // Ocultar popup después de 5 segundos
      setTimeout(() => {
        this.showAchievementPopup.set(false);
      }, 5000);
    }

    this.stats.set(updatedStats);
    this.triviaService.saveStats(updatedStats);
  }

  // Guardar en leaderboard
  saveToLeaderboard(): void {
    const name = this.playerName().trim();
    if (!name) {
      alert('Por favor, introduce tu nombre');
      return;
    }

    this.triviaService.saveToLeaderboard(name, this.currentScore());
    this.showNameInput.set(false);
    this.playerName.set('');
  }

  // Volver al menú
  backToMenu(): void {
    this.gameMode.set('menu');
    this.resetGameState();
  }

  // Ver leaderboard
  showLeaderboard(): void {
    this.gameMode.set('leaderboard');
  }

  // Ver logros
  showAchievements(): void {
    this.gameMode.set('achievements');
  }

  // Obtener leaderboard
  getLeaderboard() {
    return this.triviaService.getLeaderboard();
  }

  // Obtener cantidad de logros desbloqueados
  getUnlockedCount(): number {
    const currentStats = this.stats();
    if (!currentStats) return 0;
    return currentStats.achievements.filter(a => a.unlocked).length;
  }

  // Formatear fecha
  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES');
  }

  // Timer
  startTimer(): void {
    this.timeLeft.set(15);
    this.timerInterval = setInterval(() => {
      const time = this.timeLeft();
      if (time > 0) {
        this.timeLeft.set(time - 1);
      } else {
        // Tiempo agotado, marcar como incorrecta
        if (!this.isAnswerChecked()) {
          this.isCorrect.set(false);
          this.isAnswerChecked.set(true);
          this.currentStreak.set(0);
          this.wrongAnswers.update(n => n + 1);
        }
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Obtener clase de dificultad
  getDifficultyClass(difficulty: string): string {
    return `difficulty-${difficulty}`;
  }

  // Obtener emoji de dificultad
  getDifficultyEmoji(difficulty: string): string {
    const emojis: Record<string, string> = {
      easy: '⭐',
      medium: '⭐⭐',
      hard: '⭐⭐⭐'
    };
    return emojis[difficulty] || '⭐';
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}