import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUsuario } from 'src/app/model/login-usuario';
import { AuthService } from 'src/app/service/auth.service';
import { TokenService } from 'src/app/service/token.service';

const STORAGE_ATTEMPTS_KEY = 'pti_login_attempts';
const STORAGE_LOCK_UNTIL_KEY = 'pti_login_lock_until';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_SECONDS = 15 * 60; // 15 minutos

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('captchaCanvas', { static: false }) captchaCanvas?: ElementRef<HTMLCanvasElement>;

  isLogged = false;
  isLoginFail = false;
  loginUsuario!: LoginUsuario;
  nombreUsuario: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  roles: string[] = [];
  errMsj: string = '';

  // Protección Anti-Bots (Captcha en Canvas + Honeypot)
  captchaCode: string = '';
  captchaInput: string = '';
  honeypot: string = '';

  // Control de Intentos y Bloqueo Temporal
  maxAttempts: number = MAX_ATTEMPTS;
  intentosRestantes: number = MAX_ATTEMPTS;
  isLocked: boolean = false;
  remainingLockSeconds: number = 0;
  private lockInterval: any = null;

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
      return;
    }
    this.restaurarEstadoSeguridad();
  }

  ngAfterViewInit(): void {
    if (!this.isLogged && !this.isLocked) {
      setTimeout(() => this.generarCaptcha(), 0);
    }
  }

  ngOnDestroy(): void {
    this.detenerTemporizadorBloqueo();
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  generarCaptcha(): void {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captchaCode = code;
    this.captchaInput = '';
    this.dibujarCaptchaEnCanvas();
  }

  private dibujarCaptchaEnCanvas(): void {
    const canvasEl = this.captchaCanvas?.nativeElement;
    if (!canvasEl) {
      return;
    }
    const ctx = canvasEl.getContext('2d');
    if (!ctx) {
      return;
    }

    const width = canvasEl.width;
    const height = canvasEl.height;
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';

    ctx.clearRect(0, 0, width, height);

    // Fondo con gradiente sutil adaptado al tema
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (isDark) {
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
    } else {
      grad.addColorStop(0, '#f1f5f9');
      grad.addColorStop(1, '#e2e8f0');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Líneas de ruido anti-OCR
    const strokeColors = isDark
      ? ['rgba(56, 189, 248, 0.35)', 'rgba(129, 140, 248, 0.35)', 'rgba(148, 163, 184, 0.25)']
      : ['rgba(37, 99, 235, 0.28)', 'rgba(124, 58, 237, 0.28)', 'rgba(100, 116, 139, 0.22)'];

    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = strokeColors[i % strokeColors.length];
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width * 0.3, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        width * 0.7 + Math.random() * width * 0.3,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Puntos de interferencia
    for (let i = 0; i < 22; i++) {
      ctx.fillStyle = strokeColors[i % strokeColors.length];
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Caracteres con rotación e inclinación individual
    const textColors = isDark
      ? ['#38bdf8', '#f8fafc', '#818cf8', '#e2e8f0', '#60a5fa']
      : ['#1d4ed8', '#0f172a', '#6d28d9', '#1e293b', '#2563eb'];

    ctx.font = 'bold 21px "Outfit", "Inter", monospace';
    ctx.textBaseline = 'middle';

    const startX = 18;
    const spacing = 24;

    for (let i = 0; i < this.captchaCode.length; i++) {
      const char = this.captchaCode[i];
      ctx.save();
      const x = startX + i * spacing + (Math.random() * 4 - 2);
      const y = height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() * 28 - 14) * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = textColors[i % textColors.length];
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }

  private restaurarEstadoSeguridad(): void {
    const lockUntilStr = localStorage.getItem(STORAGE_LOCK_UNTIL_KEY);
    if (lockUntilStr) {
      const lockUntilMs = parseInt(lockUntilStr, 10);
      const nowMs = Date.now();
      if (!isNaN(lockUntilMs) && lockUntilMs > nowMs) {
        const secondsLeft = Math.ceil((lockUntilMs - nowMs) / 1000);
        this.activarBloqueoTemporal(secondsLeft);
        return;
      } else {
        localStorage.removeItem(STORAGE_LOCK_UNTIL_KEY);
        localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
      }
    }

    const usedAttempts = parseInt(localStorage.getItem(STORAGE_ATTEMPTS_KEY) || '0', 10);
    if (!isNaN(usedAttempts) && usedAttempts > 0 && usedAttempts < MAX_ATTEMPTS) {
      this.intentosRestantes = MAX_ATTEMPTS - usedAttempts;
    } else {
      this.intentosRestantes = MAX_ATTEMPTS;
    }
  }

  private activarBloqueoTemporal(seconds: number): void {
    this.isLocked = true;
    this.remainingLockSeconds = Math.max(1, seconds);
    this.intentosRestantes = 0;

    const lockUntilMs = Date.now() + this.remainingLockSeconds * 1000;
    localStorage.setItem(STORAGE_LOCK_UNTIL_KEY, lockUntilMs.toString());
    localStorage.setItem(STORAGE_ATTEMPTS_KEY, MAX_ATTEMPTS.toString());

    this.detenerTemporizadorBloqueo();
    this.lockInterval = setInterval(() => {
      const storedUntil = parseInt(localStorage.getItem(STORAGE_LOCK_UNTIL_KEY) || '0', 10);
      const diffSec = Math.ceil((storedUntil - Date.now()) / 1000);

      if (diffSec <= 0) {
        this.limpiarEstadoSeguridad();
        setTimeout(() => this.generarCaptcha(), 0);
      } else {
        this.remainingLockSeconds = diffSec;
      }
    }, 1000);
  }

  private detenerTemporizadorBloqueo(): void {
    if (this.lockInterval) {
      clearInterval(this.lockInterval);
      this.lockInterval = null;
    }
  }

  private limpiarEstadoSeguridad(): void {
    this.detenerTemporizadorBloqueo();
    this.isLocked = false;
    this.remainingLockSeconds = 0;
    this.intentosRestantes = MAX_ATTEMPTS;
    this.isLoginFail = false;
    this.errMsj = '';
    localStorage.removeItem(STORAGE_LOCK_UNTIL_KEY);
    localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
  }

  private registrarIntentoFallidoLocal(intentosServidor?: number, bloqueoSegundosServidor?: number): void {
    if (bloqueoSegundosServidor && bloqueoSegundosServidor > 0) {
      this.activarBloqueoTemporal(bloqueoSegundosServidor);
      return;
    }

    let usedAttempts = parseInt(localStorage.getItem(STORAGE_ATTEMPTS_KEY) || '0', 10);
    if (isNaN(usedAttempts)) {
      usedAttempts = 0;
    }
    usedAttempts++;

    if (typeof intentosServidor === 'number') {
      const serverUsed = MAX_ATTEMPTS - intentosServidor;
      usedAttempts = Math.max(usedAttempts, serverUsed);
    }

    localStorage.setItem(STORAGE_ATTEMPTS_KEY, usedAttempts.toString());
    this.intentosRestantes = Math.max(0, MAX_ATTEMPTS - usedAttempts);

    if (this.intentosRestantes <= 0) {
      this.activarBloqueoTemporal(LOCK_DURATION_SECONDS);
    } else {
      this.generarCaptcha();
    }
  }

  get tiempoBloqueoFormateado(): string {
    const mins = Math.floor(this.remainingLockSeconds / 60);
    const secs = this.remainingLockSeconds % 60;
    const minsPad = mins < 10 ? `0${mins}` : `${mins}`;
    const secsPad = secs < 10 ? `0${secs}` : `${secs}`;
    return `${minsPad}:${secsPad}`;
  }

  onLogin(): void {
    if (this.isLocked) {
      return;
    }

    // 1. Verificación de Honeypot invisible (detección directa de bots automatizados)
    if (this.honeypot && this.honeypot.trim().length > 0) {
      this.activarBloqueoTemporal(LOCK_DURATION_SECONDS);
      this.isLoginFail = true;
      this.errMsj = 'Actividad automatizada detectada. Acceso bloqueado temporalmente.';
      return;
    }

    // 2. Validación de campos vacíos
    if (!this.nombreUsuario.trim() || !this.password.trim()) {
      this.isLoginFail = true;
      this.errMsj = 'Por favor complete su usuario y contraseña.';
      return;
    }

    // 3. Validación del código de seguridad Anti-Bots
    if (!this.captchaInput.trim()) {
      this.isLoginFail = true;
      this.errMsj = 'Por favor ingrese el código de verificación anti-bots.';
      return;
    }

    if (this.captchaInput.trim().toUpperCase() !== this.captchaCode.toUpperCase()) {
      this.isLoginFail = true;
      this.registrarIntentoFallidoLocal();
      if (this.isLocked) {
        this.errMsj = 'Has superado los 5 intentos permitidos. Acceso bloqueado por 15 minutos.';
      } else {
        this.errMsj = `Código de verificación incorrecto. Te quedan ${this.intentosRestantes} intento(s).`;
      }
      return;
    }

    this.isLoading = true;
    this.isLoginFail = false;
    this.errMsj = '';

    this.loginUsuario = new LoginUsuario(this.nombreUsuario.trim(), this.password);
    this.authService.login(this.loginUsuario).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.limpiarEstadoSeguridad();
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

        const serverRemaining = err.error?.intentosRestantes;
        const serverLockSeconds = err.error?.bloqueadoSegundos;

        if (err.status === 429 || (typeof serverRemaining === 'number' && serverRemaining <= 0)) {
          this.activarBloqueoTemporal(serverLockSeconds || LOCK_DURATION_SECONDS);
          this.errMsj =
            err.error?.mensaje ||
            'Has superado el límite de 5 intentos fallidos. Acceso bloqueado por 15 minutos.';
          return;
        }

        this.registrarIntentoFallidoLocal(serverRemaining, serverLockSeconds);
        this.errMsj =
          err.error?.mensaje ||
          `Nombre de usuario o contraseña incorrectos. Te quedan ${this.intentosRestantes} intento(s).`;
      }
    });
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.isLogged = false;
    this.roles = [];
    setTimeout(() => this.generarCaptcha(), 0);
  }
}
