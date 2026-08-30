import { Component, OnInit } from '@angular/core';
import { persona } from 'src/app/model/persona.model';
import { PersonaService } from 'src/app/service/persona.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css'],
  standalone: false
})
export class AcercaDeComponent implements OnInit {
  persona: persona = new persona(
    'Tomás',
    'Peresin',
    'assets/foto-perfil.jpg',
    'Especializado en diseño y construcción de arquitecturas backend robustas, modelado de bases de datos relacionales, relevamiento funcional y aseguramiento de calidad de software.',
    ''
  );
  isLogged: boolean = false;

  constructor(
    public personaService: PersonaService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.personaService.getPersonas().subscribe({
      next: (data) => {
        if (data && data.nombre) {
          this.persona = data;
        }
      },
      error: (err) => {
        // Mantiene los valores por defecto si el backend tarda en responder
        console.warn('Backend aún iniciando o error al obtener perfil:', err);
      }
    });
  }
}
