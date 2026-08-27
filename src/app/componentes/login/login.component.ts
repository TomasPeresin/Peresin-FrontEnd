import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUsuario } from 'src/app/model/login-usuario';
import { AuthService } from 'src/app/service/auth.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  isLogged = false;
  isLoginFail = false;
  loginUsuario!: LoginUsuario;
  nombreUsuario: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  roles: string[] = [];
  errMsj: string = '';

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (!this.nombreUsuario.trim() || !this.password.trim()) {
      this.isLoginFail = true;
      this.errMsj = 'Por favor complete todos los campos requeridos.';
      return;
    }

    this.isLoading = true;
    this.isLoginFail = false;
    this.errMsj = '';

    this.loginUsuario = new LoginUsuario(this.nombreUsuario.trim(), this.password);
    this.authService.login(this.loginUsuario).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.isLogged = true;
        this.isLoginFail = false;
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = this.tokenService.getAuthorities();
        this.router.navigate(['']);
      },
      error: (err) => {
        this.isLoading = false;
        this.isLogged = false;
        this.isLoginFail = true;
        this.errMsj = err.error?.mensaje || 'Error al iniciar sesión. Verifique sus credenciales.';
      }
    });
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.isLogged = false;
    this.roles = [];
  }
}
