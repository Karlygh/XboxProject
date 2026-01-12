import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ],
  templateUrl: './login-register.html',
  styleUrl: './login-register.css',
})
export class LoginRegister {

}