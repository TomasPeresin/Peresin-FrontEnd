import { Component, OnInit } from '@angular/core';
import { Proyecto } from 'src/app/model/proyecto';
import { SProyectoService } from 'src/app/service/s-proyecto.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
    selector: 'app-proyectos',
    templateUrl: './proyectos.component.html',
    styleUrls: ['./proyectos.component.css'],
    standalone: false
})
export class ProyectosComponent implements OnInit {
  proyectos: Proyecto[] = []; 
  filtroActivo: string = 'todos';
  isLogged = false;

  constructor(private sProyecto: SProyectoService, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.cargarProyecto();
    this.isLogged = !!this.tokenService.getToken();
  }

  cargarProyecto(): void {
    this.sProyecto.lista().subscribe(data => {
      this.proyectos = data;
    });
  }

  setFiltro(filtro: string): void {
    this.filtroActivo = filtro;
  }

  get proyectosFiltrados(): Proyecto[] {
    if (this.filtroActivo === 'todos') {
      return this.proyectos;
    }
    const query = this.filtroActivo.toLowerCase();
    return this.proyectos.filter(p => 
      (p.nombre && p.nombre.toLowerCase().includes(query)) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(query))
    );
  }

  isGitHubLink(url?: string): boolean {
    return !!url && url.toLowerCase().includes('github.com');
  }

  isDocLink(url?: string): boolean {
    return !!url && (url.toLowerCase().includes('drive') || url.toLowerCase().includes('docs') || url.toLowerCase().includes('.pdf'));
  }

  delete(id?: number): void {
    if (id != undefined) {
      if (confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
        this.sProyecto.delete(id).subscribe(
          data => {
            this.cargarProyecto();
          },
          err => {
            alert("No se pudo borrar el proyecto");
          }
        );
      }
    }
  }
}
