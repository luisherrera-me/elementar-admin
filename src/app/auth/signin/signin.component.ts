import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { HDividerComponent } from '@elementar/components/divider';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    RouterLink,
    MatButton,
    CommonModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    //HDividerComponent
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  tokenEmail: string | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  login(): void {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    
    // Primero, realiza el login
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Si el token está presente, buscar por el email
        this.authService.searchByEmail(this.email).subscribe({
          next: (response) => {
            console.log('Respuesta de búsqueda por email:', response);
            // Navegar al dashboard
            this.router.navigate(['pages/dashboard']);
          },
          error: (err) => {
            console.error('Error al buscar por email:', err);
          }
        });
      },
      error: (err) => {
        console.error('Login Fallido', err);
      }
    });
  }
}
