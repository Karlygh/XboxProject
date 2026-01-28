import { Routes } from '@angular/router';
import { LoginRegister } from './home/login-register/login-register';
import { HomePage } from './home/home-page/home-page';
import { BusquedaJuegos } from './home/busqueda-juegos/busqueda-juegos';
import { XboxExclusivesComponent } from './home/xbox-exclusives/xbox-exclusives';
import { HomeCabecera } from './home/home-cabecera/home-cabecera';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'buscar', component: BusquedaJuegos },
    { path: 'sagas', component: XboxExclusivesComponent },
    { path: 'exclusivos', component: HomeCabecera },
    { path: 'login', component: LoginRegister },
    { path: '**', redirectTo: '' }
];