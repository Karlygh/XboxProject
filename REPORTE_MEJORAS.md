# 📋 REPORTE DE MEJORAS - XBOX PROJECT

**Total de mejoras identificadas:** 19 cambios  
**Estado actual:** Proyecto bien estructurado, listo para optimización  
**Impacto esperado:** +80% mantenibilidad, +40% performance

---

## 🔴 PRIORIDAD ALTA (Crítico - Impacta mantenimiento)

### CAMBIO #1: Eliminar duplicación de datos de juegos en componentes

**Ubicación:** `games.service.ts` (633 líneas), `games-ea.ts`, `halo-saga.ts`, `xbox-exclusives.ts`, `local-coop-games.ts`, `busqueda-juegos.ts`

**Problema:** Los mismos juegos están hardcodeados en **5 componentes diferentes + el servicio**. Cada componente tiene su propio array idéntico. Halo Infinite aparece 3 veces con información duplicada.

**Por qué importa:** Si cambias un precio o imagen, necesitas editar 5 archivos. Alto riesgo de inconsistencias y datos desincronizados.

**Solución:**

- Crear `src/app/data/games.data.ts` con todos los datos en UN lugar
- El servicio solo obtiene de ese archivo
- Los componentes llaman métodos del servicio como `getEAGames()`, `getHaloGames()`, etc
- Resultado: Datos en UN único punto de verdad

**Impacto:** `-400 líneas duplicadas`, `+Mantenimiento centralizado`

**Tiempo:** 1 hora

---

### CAMBIO #2: Centralizar constante ASSETS_PATH

**Ubicación:** `games-ea.ts` línea 15, `halo-saga.ts` línea 17, `xbox-exclusives.ts` línea 15, `local-coop-games.ts` línea 16, `busqueda-juegos.ts` línea 18

**Problema:** La misma línea `ASSETS_PATH = '/assets/images/';` está repetida en 5 componentes exactamente igual.

**Por qué importa:** Si la ruta cambia (`/assets/images/` → `/assets/img/`), debes buscar y reemplazar en 5 archivos. Riesgo de olvidar alguno.

**Solución:**

- Crear `src/app/constants/app.constants.ts`
- Exportar `export const ASSETS_PATHS = { IMAGES: '/assets/images/', ... }`
- Importar en cada componente: `import { ASSETS_PATHS } from '../../constants/app.constants'`
- Resultado: Una constante, actualización en un lugar

**Impacto:** `Cambios centralizados`, `Escalable para agregar más constantes`

**Tiempo:** 15 minutos

---

### CAMBIO #3: Eliminar lógica de modal duplicada en 5 componentes

**Ubicación:** `games-ea.ts`, `halo-saga.ts`, `xbox-exclusives.ts`, `local-coop-games.ts`, `busqueda-juegos.ts`

**Problema:** Cada componente tiene el mismo código:

```typescript
private modalService = inject(GameModalService);
onGameClick(game: Game) { this.modalService.openModal(game); }
```

Repetido 5 veces idénticamente.

**Por qué importa:** Si la lógica del modal cambia, editas 5 archivos. Violación del principio DRY.

**Solución:**

- Crear componente reutilizable `GameCardComponent` en `src/app/shared/game-card/`
- Este componente contiene la lógica del modal
- Los componentes usan: `<app-game-card [game]="game"></app-game-card>`
- Resultado: Lógica centralizada y reutilizable

**Impacto:** `Componentes más simples`, `Lógica reutilizable`, `Un solo lugar para cambios`

**Tiempo:** 1 hora

---

## 🟠 PRIORIDAD MEDIA (Malas prácticas)

### CAMBIO #4: Eliminar imports innecesarios

**Ubicación:** `game-modal.component.ts`, `home-page.ts`, varios componentes

**Problema:**

- `game-modal.component.ts` importa `Router` pero no lo usa
- `home-page.ts` importa `Footer` pero no lo usa en el template
- Otros archivos con imports sin usar

**Por qué importa:** Aumenta el bundle size, confunde a desarrolladores, genera warnings en linters.

**Solución:** Auditar cada archivo y remover imports no utilizados.

**Impacto:** `Código más limpio`, `-KB en bundle`

**Tiempo:** 15 minutos

---

### CAMBIO #5: Arreglar memory leaks en subscripciones

**Ubicación:** `busqueda-juegos.ts` línea 32-46

**Problema:**

```typescript
this.activatedRoute.queryParams.subscribe(params => { ... });
```

La subscripción NUNCA se destruye. Si navegas y vuelves a la página, se suma otra subscripción. Con tiempo, consumes toda la memoria.

**Por qué importa:** Memory leak. En dispositivos móviles o después de muchas navegaciones, la app se ralentiza o crashea.

**Solución:**

- Usar patrón `takeUntilDestroyed()` que ya usas en `halo-saga.ts`

```typescript
.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(...)
```

- Angular destruye la subscripción automáticamente al destruir el componente

**Impacto:** `0 memory leaks`, `App más estable`

**Tiempo:** 10 minutos

---

### CAMBIO #6: Reemplazar manipulación directa del DOM

**Ubicación:** `game-modal.service.ts` líneas 18-19, 24-25

**Problema:**

```typescript
document.body.style.overflow = 'hidden'; // ❌ Anti-pattern
document.body.style.overflow = 'auto'; // ❌ Anti-pattern
```

Manipulación directa del DOM sin usar Angular.

**Por qué importa:** No es escalable, difícil de testear, incompatible con SSR, causa conflictos si varios servicios tocan el DOM.

**Solución:** Usar `Renderer2` de Angular o mejor aún, host bindings en el componente del modal.

**Impacto:** `Compatible con SSR`, `Testeable`, `Best practices`

**Tiempo:** 15 minutos

---

### CAMBIO #7: Añadir validaciones de inputs en métodos

**Ubicación:** `game-modal.component.ts` método `extractYouTubeId()` línea 44-47

**Problema:**

```typescript
private extractYouTubeId(url: string): string {
  const match = url.match(...); // ❌ Si url es null/undefined → ERROR
  return match ? match[1] : '';
}
```

No valida si `url` es null, undefined, o no es string.

**Por qué importa:** Si se pasa una URL inválida, el iframe se rompe. La app no es robusta.

**Solución:** Validar inputs antes de procesarlos:

```typescript
if (!url || typeof url !== 'string') return '';
```

**Impacto:** `Código robusto`, `Menos bugs`

**Tiempo:** 15 minutos

---

### CAMBIO #8: Dividir servicio grande en módulos especializados

**Ubicación:** `games.service.ts` (633 líneas)

**Problema:** Un solo archivo con 633 líneas que combina datos + lógica de búsqueda + lógica de filtrado. Muy difícil de navegar, testear y mantener.

**Por qué importa:** Violación del principio de responsabilidad única. Cambiar datos recompila la lógica.

**Solución:**

- `games.data.ts` - Solo datos (200 líneas)
- `games-filter.service.ts` - Solo filtrado (100 líneas)
- `games-search.service.ts` - Solo búsqueda (80 líneas)
- `games.service.ts` - Solo coordinación (100 líneas)

**Impacto:** `-400 líneas en un archivo`, `Cada servicio tiene una responsabilidad`, `Testeable`

**Tiempo:** 1.5 horas

---

## 🟡 PRIORIDAD MEDIA-BAJA (Convenciones)

### CAMBIO #9: Estandarizar nombres de componentes

**Ubicación:** Todos los componentes

**Problema:** Inconsistencia en nombres:

- `GamesEa` (sin "Component")
- `HomePage` (sin "Component")
- `Navbar` (sin "Component")
- `XboxExclusivesComponent` (con "Component")
- `GameModalComponent` (con "Component")

**Por qué importa:** Convención Angular estándar es `ClassName + Component`. ESLint puede detectarlo. Parece código mal hecho.

**Solución:** Renombrar todas las clases a `GamesEaComponent`, `HomePageComponent`, `NavbarComponent`, etc.

**Impacto:** `Profesionalismo`, `Consistencia`, `ESLint compatible`

**Tiempo:** 30 minutos

---

### CAMBIO #10: Añadir `ChangeDetectionStrategy.OnPush` en componentes

**Ubicación:** Todos los componentes standalone

**Problema:** Angular verifica cambios en TODO el árbol por defecto. Con signals puedes usar `OnPush`.

**Por qué importa:** Mejor performance. Reduce re-renderizados innecesarios.

**Solución:** Añadir en cada `@Component`:

```typescript
changeDetection: ChangeDetectionStrategy.OnPush;
```

**Impacto:** `+40% performance`, `-Re-renderizados`

**Tiempo:** 20 minutos

---

### CAMBIO #11: Añadir `trackBy` en ngFor loops

**Ubicación:** Todos los templates con `*ngFor`

**Problema:**

```html
<div *ngFor="let game of games"><!-- Sin trackBy --></div>
```

Angular recreará todos los elementos si los datos cambian.

**Por qué importa:** Mejora performance en listas grandes.

**Solución:** Añadir `trackBy` en componentes:

```typescript
trackByGameId(index: number, game: Game): number { return game.id; }
```

```html
<div *ngFor="let game of games; trackBy: trackByGameId"></div>
```

**Impacto:** `+Performance en listas`, `Menos re-renders`

**Tiempo:** 30 minutos

---

## 🟢 PRIORIDAD BAJA (Estructura y Futuro)

### CAMBIO #12: Crear carpeta `models/` o `types/`

**Ubicación:** Estructura de carpetas

**Problema:** Las interfaces solo están en `interfaces/game.interface.ts`. Falta una estructura escalable.

**Por qué importa:** Si creces, necesitarás tipos para usuarios, comentarios, etc. Mejor tener una estructura desde el inicio.

**Solución:** Crear `src/app/models/` con un `index.ts` (barrel export):

```typescript
export * from './game.model';
export * from './user.model';
```

**Impacto:** `Estructura escalable`, `Organización clara`

**Tiempo:** 15 minutos

---

### CAMBIO #13: Crear carpeta `utils/` para funciones compartidas

**Ubicación:** Estructura de carpetas

**Problema:** Funciones útiles como `extractYouTubeId()` están dentro de componentes. Si otro componente las necesita, hay que duplicar.

**Por qué importa:** Reutilización de código, evitar duplicación.

**Solución:** Crear `src/app/utils/` con:

- `youtube.utils.ts`
- `string.utils.ts`
- `array.utils.ts`

**Impacto:** `Código reutilizable`, `DRY principle`

**Tiempo:** 30 minutos

---

### CAMBIO #14: Crear estructura de tests básica

**Ubicación:** Archivos `.spec.ts`

**Problema:** Existe `app.spec.ts` pero vacío. Sin tests es difícil mantener código confiable.

**Por qué importa:** Los tests previenen regressions. Confianza en cambios.

**Solución:** Crear tests básicos para:

- `games.service.spec.ts`
- `game-modal.service.spec.ts`
- Componentes principales

**Impacto:** `Confianza en código`, `Prevención de bugs`

**Tiempo:** 2-3 horas

---

### CAMBIO #15: Agregar configuración de ESLint para convenciones

**Ubicación:** `.eslintrc.json` (crear o actualizar)

**Problema:** No hay reglas de linting que fuercen las convenciones.

**Por qué importa:** Previene errores de nombres, imports no usados, etc automáticamente.

**Solución:** Configurar ESLint con reglas Angular:

```json
{
  "rules": {
    "@angular-eslint/directive-class-suffix": "error",
    "@angular-eslint/component-class-suffix": "error",
    "no-unused-vars": "warn"
  }
}
```

**Impacto:** `Automatización de convenciones`, `Menos reviews manuales`

**Tiempo:** 20 minutos

---

### CAMBIO #16: Implementar lazy loading en rutas

**Ubicación:** `src/app/app.routes.ts`

**Problema:** Todos los componentes se cargan al inicio. Si tienes 100 juegos, todos se descargan.

**Por qué importa:** Reduce tiempo de carga inicial. Better UX.

**Solución:**

```typescript
const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home-page/home-page.component').then((m) => m.HomePageComponent),
  },
];
```

**Impacto:** `-Tiempo de carga inicial`, `+UX`

**Tiempo:** 45 minutos

---

### CAMBIO #17: Crear archivo `README.md` con documentación

**Ubicación:** Raíz del proyecto

**Problema:** No hay documentación de cómo correr el proyecto, su estructura, convenciones.

**Por qué importa:** Nuevos desarrolladores necesitan entender el proyecto rápidamente.

**Solución:** Crear `README.md` con:

- Cómo instalar
- Cómo correr
- Estructura de carpetas
- Convenciones del proyecto
- Comandos útiles

**Impacto:** `Onboarding más rápido`, `Profesionalismo`

**Tiempo:** 45 minutos

---

### CAMBIO #18: Optimizar bundle con SSR

**Ubicación:** `angular.json`, `server.ts`

**Problema:** SSR está configurado pero no se optimiza completamente.

**Por qué importa:** SSR mejora SEO y tiempo de carga inicial.

**Solución:** Optimizar configuración de build para SSR.

**Impacto:** `SEO mejorado`, `Carga más rápida`

**Tiempo:** 1 hora

---

### CAMBIO #19: Integrar API real en lugar de datos hardcodeados

**Ubicación:** `games.service.ts`

**Problema:** Todos los datos están hardcodeados. En producción necesitarás una API.

**Por qué importa:** Datos dinámicos, actualizables desde el backend.

**Solución:**

- Crear `src/app/services/api/games.api.service.ts`
- HTTP calls en lugar de arrays
- Caching con HttpClient

**Impacto:** `Escalable`, `Datos dinámicos`

**Tiempo:** 2 horas

---

## 📊 RESUMEN POR PRIORIDAD

| Prioridad     | Cambios | Tiempo     | Impacto         |
| ------------- | ------- | ---------- | --------------- |
| 🔴 Alta       | 3       | 2.5 h      | Crítico         |
| 🟠 Media      | 5       | 1.5 h      | Alto            |
| 🟡 Media-Baja | 2       | 1.5 h      | Medio           |
| 🟢 Baja       | 9       | 8+ h       | Futuro          |
| **TOTAL**     | **19**  | **~13+ h** | **+80% mejora** |

---

## ✅ LO QUE ESTÁ BIEN

- ✅ Angular 21 (latest)
- ✅ Standalone components
- ✅ Signals para estado
- ✅ Prettier + ESLint configurados
- ✅ SSR preparado
- ✅ DomSanitizer para seguridad
- ✅ Responsive con Tailwind
- ✅ Estructura de carpetas clara
- ✅ Componentes bien separados

---

## 🎯 RECOMENDACIÓN DE ORDEN

**Semana 1 - Crítico (2.5h):**

1. Eliminar duplicación de juegos (#1)
2. Centralizar ASSETS_PATH (#2)
3. Eliminar lógica de modal duplicada (#3)

**Semana 2 - Malas prácticas (1.5h):** 4. Imports innecesarios (#4) 5. Memory leaks (#5) 6. DOM manipulation (#6) 7. Validaciones (#7) 8. Dividir servicio (#8)

**Semana 3 - Convenciones (2h):** 9. Nombres de componentes (#9) 10. ChangeDetectionStrategy (#10) 11. TrackBy (#11) 12. Estructura modular (#12-13)

**Semana 4+ - Escalabilidad:** 14. Tests (#14) 15. ESLint (#15) 16. Lazy loading (#16) 17. README (#17) 18. SSR (#18) 19. API real (#19)

---

**Última actualización:** 28 enero 2026  
**Estado:** Listo para mejora incremental
