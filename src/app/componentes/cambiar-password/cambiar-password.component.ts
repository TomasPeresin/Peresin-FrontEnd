import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css'],
  standalone: false
})
export class CambiarPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  isCheckingToken: boolean = true;
  isTokenValid: boolean = false;
  tokenErrorMsj: string = '';

  isLoading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  errMsj: string = '';
  successMsj: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.isCheckingToken = false;
        this.isTokenValid = false;
        this.tokenErrorMsj = 'No se ha proporcionado un token de restablecimiento.';
      } else {
        this.verificarToken();
      }
    });
  }

  verificarToken(): void {
    this.isCheckingToken = true;
    this.authService.verificarToken(this.token).subscribe({
      next: () => {
        this.isCheckingToken = false;
        this.isTokenValid = true;
      },
      error: (err) => {
        this.isCheckingToken = false;
        this.isTokenValid = false;
        this.tokenErrorMsj = err.error?.mensaje || 'El enlace de restablecimiento es inválido o ha expirado.';
      }
    });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.isError = false;
    this.errMsj = '';
    this.isSuccess = false;

    if (!this.newPassword.trim() || !this.confirmPassword.trim()) {
      this.isError = true;
      this.errMsj = 'Por favor complete todos los campos.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.isError = true;
      this.errMsj = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.isError = true;
      this.errMsj = 'Las contraseñas no coinciden.';
      return;
    }

    this.isLoading = true;

    this.authService.cambiarPassword(this.token, this.newPassword).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.successMsj = res.mensaje || 'Tu contraseña ha sido actualizada con éxito.';
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.errMsj = err.error?.mensaje || 'No se pudo actualizar la contraseña. El enlace puede haber expirado.';
      }
    });
  }
}
