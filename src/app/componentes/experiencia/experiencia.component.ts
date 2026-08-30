import { Component, OnInit } from '@angular/core';
import { Experiencia } from 'src/app/model/experiencia';
import { SExperienciaService } from 'src/app/service/s-experiencia.service';
import { TokenService } from 'src/app/service/token.service';
import { LoadingState } from 'src/app/model/loading-state';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css'],
  standalone: false
})
export class ExperienciaComponent implements OnInit {
  expe: Experiencia[] = [];
  state: LoadingState = 'loading';
  isLogged = false;

  constructor(private sExperiencia: SExperienciaService, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.cargarExperiencia();
    this.isLogged = !!this.tokenService.getToken();
  }

  cargarExperiencia(): void {
    this.state = 'loading';
    this.sExperiencia.lista().subscribe({
      next: (data) => {
        this.expe = data;
        this.state = 'success';
      },
      error: (err) => {
        console.error('Error al cargar experiencia:', err);
        this.state = 'error';
      }
    });
  }

  getTechList(exp: Experiencia): string[] {
    if (!exp.tecnologias) {
      return [];
    }
    return exp.tecnologias.split(',').map(t => t.trim()).filter(t => t.length > 0);
  }

  delete(id?: number): void {
    if (id != undefined) {
      if (confirm("¿Estás seguro de que deseas eliminar esta experiencia?")) {
        this.sExperiencia.delete(id).subscribe({
          next: () => {
            this.cargarExperiencia();
          },
          error: () => {
            alert("No se pudo borrar la experiencia");
          }
        });
      }
    }
  }
}
