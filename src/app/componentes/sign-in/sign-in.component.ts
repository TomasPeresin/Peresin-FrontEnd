import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NuevoUsuario } from 'src/app/model/nuevo-usuario';
import { AuthService } from 'src/app/service/auth.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  nombre: String='';
  nombreUsuario: String='';
  email: String='';
  password: String='';
  authorities: String[] = ["user"];

  constructor(private tokenService: TokenService, private authService: AuthService, private router: Router) {}

  ngOnInit() :void{
  }

  onSignIn(): void{
    const nuevoUsuario = new NuevoUsuario(this.nombre, this.nombreUsuario, this.email, this.password, this.authorities); 
    this.authService.nuevo(nuevoUsuario).subscribe(data =>{
      alert("Usuario añadido");
      this.router.navigate(['']);
      }, err => {
        alert("Nuevo usuario fallo");
        this.router.navigate(['']);
        });
  }
}

