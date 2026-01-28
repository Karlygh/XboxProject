import { Component, HostListener, inject, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GameModalService } from '../../services/game-modal.service';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-modal',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './game-modal.component.html',
  styleUrl: './game-modal.component.css'
})
export class GameModalComponent {
  private modalService = inject(GameModalService);
  private sanitizer = inject(DomSanitizer);
  private renderer = inject(Renderer2);

  constructor() {
    this.modalService.setRenderer(this.renderer);
  }

  readonly isOpen = this.modalService.isOpen;
  readonly selectedGame = this.modalService.selectedGame;

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.closeModal();
  }

  closeModal() {
    this.modalService.closeModal();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onBuyClick() {
    this.closeModal(); // Cierra el modal antes de navegar
  }

  getYouTubeEmbedUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYouTubeId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private extractYouTubeId(url: string): string {
    if (!url || typeof url !== 'string') return '';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  }
}