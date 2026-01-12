import { Routes } from '@angular/router';
import { LoginRegister } from './home/login-register/login-register';
import { HomePage } from './home/home-page/home-page';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'login', component: LoginRegister },
    { path: '**', redirectTo: '' }
];