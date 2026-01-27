import { Routes } from '@angular/router';
import { LoginRegister } from './home/login-register/login-register';
import { HomePage } from './home/home-page/home-page';
import { BusquedaJuegos } from './home/busqueda-juegos/busqueda-juegos';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'buscar', component: BusquedaJuegos },
    { path: 'login', component: LoginRegister },
    { path: '**', redirectTo: '' }
];