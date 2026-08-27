import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NuevoUsuario } from 'src/app/model/nuevo-usuario';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone: false
})
export class SignInComponent implements OnInit {
  nombre: string = '';
  nombreUsuario: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  codigoAdmin: string = '';

  showAdminCode: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  errMsj: string = '';
  successMsj: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleAdminCode(): void {
    this.showAdminCode = !this.showAdminCode;
    if (!this.showAdminCode) {
      this.codigoAdmin = '';
    }
  }

  onSignIn(): void {
    this.isError = false;
    this.errMsj = '';
    this.isSuccess = false;

    // Validaciones en cliente
    if (!this.nombre.trim() || !this.nombreUsuario.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      this.isError = true;
      this.errMsj = 'Por favor complete todos los campos obligatorios.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email.trim())) {
      this.isError = true;
      this.errMsj = 'Por favor ingrese un formato de correo electrónico válido.';
      return;
    }

    if (this.password.length < 6) {
      this.isError = true;
      this.errMsj = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.isError = true;
      this.errMsj = 'Las contraseñas no coinciden. Por favor verifíquelas.';
      return;
    }

    this.isLoading = true;

    const nuevoUsuario = new NuevoUsuario(
      this.nombre.trim(),
      this.nombreUsuario.trim(),
      this.email.trim(),
      this.password,
      ['user'],
      this.codigoAdmin.trim() ? this.codigoAdmin.trim() : undefined
    );

    this.authService.nuevo(nuevoUsuario).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.successMsj = res.mensaje || '¡Usuario registrado con éxito! Redirigiendo al inicio de sesión...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.errMsj = err.error?.mensaje || 'Hubo un error al registrar el usuario. Por favor intente nuevamente.';
      }
    });
  }
}
