import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css'],
  standalone: false
})
export class EncabezadoComponent implements OnInit {
  isLogged = false;
  userName = '';
  showDropdown = false;
  isDark = false;

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit() {
    this.checkLoginStatus();
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDark = savedTheme === 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  }

  checkLoginStatus(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.userName = this.tokenService.getUserName() || 'Usuario';
  }

  Login(): void {
    this.router.navigate(['/login']);
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }

  toggleNavbar(): void {
    const navbar = document.getElementById('navbarSupportedContent');
    if (navbar) {
      navbar.classList.toggle('show');
    }
  }

  closeNavbar(): void {
    const navbar = document.getElementById('navbarSupportedContent');
    if (navbar && navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    const newTheme = this.isDark ? 'dark' : 'light';

    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
}
