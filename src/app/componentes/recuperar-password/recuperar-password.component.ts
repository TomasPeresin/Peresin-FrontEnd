import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
  standalone: false
})
export class RecuperarPasswordComponent implements OnInit {
  email: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  errMsj: string = '';
  successMsj: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.isError = false;
    this.errMsj = '';
    this.isSuccess = false;

    if (!this.email.trim()) {
      this.isError = true;
      this.errMsj = 'Por favor ingrese su correo electrónico.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email.trim())) {
      this.isError = true;
      this.errMsj = 'Por favor ingrese un formato de correo electrónico válido.';
      return;
    }

    this.isLoading = true;

    this.authService.solicitarRecuperacion(this.email.trim()).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.successMsj = res.mensaje || 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña.';
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.errMsj = err.error?.mensaje || 'No se pudo procesar la solicitud. Verifique que el correo esté registrado.';
      }
    });
  }
}
