import { Routes } from '@angular/router';
import { LoginRegister } from './home/login-register/login-register';
import { HomePage } from './home/home-page/home-page';
import { BusquedaJuegos } from './home/busqueda-juegos/busqueda-juegos';
import { XboxExclusivesComponent } from './home/xbox-exclusives/xbox-exclusives';
import { HomeCabecera } from './home/home-cabecera/home-cabecera';
import { Legal } from './about/legal/legal';
import { SobreNosotros } from './about/sobre-nosotros/sobre-nosotros';
import { Contacto } from './about/contacto/contacto';
import { Noticias } from './noticias/noticias';
import { Trivia } from './trivia/trivia';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'buscar', component: BusquedaJuegos },
    { path: 'sagas', component: XboxExclusivesComponent },
    { path: 'exclusivos', component: HomeCabecera },
    { path: 'login', component: LoginRegister },
    { path: 'legal', component: Legal},
    { path: 'sobre-nosotros', component: SobreNosotros},
    { path: 'contacto', component: Contacto },
     { path: 'noticias', component: Noticias },
     { path: 'trivia', component: Trivia },
    { path: '**', redirectTo: '' }, 
];