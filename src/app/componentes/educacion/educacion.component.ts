import { Component, OnInit } from '@angular/core';
import { Educacion } from 'src/app/model/educacion';
import { SEducacionService } from 'src/app/service/s-educacion.service';
import { TokenService } from 'src/app/service/token.service';
import { LoadingState } from 'src/app/model/loading-state';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css'],
  standalone: false
})
export class EducacionComponent implements OnInit {
  educacion: Educacion[] = [];
  state: LoadingState = 'loading';
  isLogged = false;

  constructor(
    private sEducacion: SEducacionService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.cargarEducacion();
    this.isLogged = !!this.tokenService.getToken();
  }

  cargarEducacion(): void {
    this.state = 'loading';
    this.sEducacion.lista().subscribe({
      next: (data) => {
        this.educacion = data;
        this.state = 'success';
      },
      error: (err) => {
        console.error('Error al cargar educación:', err);
        this.state = 'error';
      }
    });
  }

  delete(id?: number): void {
    if (id != undefined) {
      if (confirm('¿Estás seguro de que deseas eliminar esta educación?')) {
        this.sEducacion.delete(id).subscribe({
          next: () => {
            this.cargarEducacion();
          },
          error: () => {
            alert('No se pudo borrar la educación');
          }
        });
      }
    }
  }
}
