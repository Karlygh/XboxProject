import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface FormData {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  contactForm: FormGroup;
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);
  charCount = signal(0);
  readonly maxChars = 500;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });

    // Escuchar cambios en el textarea para actualizar contador
    this.contactForm.get('mensaje')?.valueChanges.subscribe(value => {
      this.charCount.set(value?.length || 0);
    });
  }

  // Getters para acceder fácilmente a los controles del formulario
  get nombre() { return this.contactForm.get('nombre'); }
  get email() { return this.contactForm.get('email'); }
  get asunto() { return this.contactForm.get('asunto'); }
  get mensaje() { return this.contactForm.get('mensaje'); }

  // Verificar si un campo tiene errores y ha sido tocado
  hasError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Obtener mensaje de error específico para cada campo
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'Este campo es obligatorio';
    }
    
    if (field.errors['email']) {
      return 'Por favor, introduce un email válido';
    }
    
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    
    if (field.errors['maxlength']) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    return '';
  }

  // Simular envío del formulario
  async onSubmit(): Promise<void> {
    // Marcar todos los campos como tocados para mostrar errores
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });

    // Si el formulario no es válido, no continuar
    if (this.contactForm.invalid) {
      // Hacer scroll al primer campo con error
      this.scrollToFirstError();
      return;
    }

    // Resetear estados
    this.submitSuccess.set(false);
    this.submitError.set(false);
    this.isSubmitting.set(true);

    try {
      // Simular petición HTTP (reemplazar con servicio real)
      await this.simulateApiCall(this.contactForm.value);

      // Éxito
      this.submitSuccess.set(true);
      this.contactForm.reset();
      this.charCount.set(0);

      // Scroll hacia arriba para ver el mensaje de éxito
      this.scrollToTop();

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        this.submitSuccess.set(false);
      }, 5000);

    } catch (error) {
      // Error
      this.submitError.set(true);

      // Scroll hacia arriba para ver el mensaje de error
      this.scrollToTop();

      // Ocultar mensaje de error después de 5 segundos
      setTimeout(() => {
        this.submitError.set(false);
      }, 5000);

    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Método para hacer scroll suave hacia arriba
  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Método para hacer scroll al primer campo con error
  private scrollToFirstError(): void {
    const firstInvalidControl = document.querySelector('.form-group.has-error');
    
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  // Simular llamada a API
  private simulateApiCall(data: FormData): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Datos del formulario:', data);
      
      // Simular delay de red (1.5 segundos)
      setTimeout(() => {
        // 90% de éxito, 10% de error para testing
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Error en el envío'));
        }
      }, 1500);
    });
  }

}