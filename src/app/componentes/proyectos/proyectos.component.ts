import { Component, OnInit } from '@angular/core';
import { Proyecto } from 'src/app/model/proyecto';
import { SProyectoService } from 'src/app/service/s-proyecto.service';
import { TokenService } from 'src/app/service/token.service';

export interface CategoryMeta {
  id: string;
  label: string;
  icon: string;
  badgeClass: string;
}

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

  private categoryMap: Record<string, CategoryMeta> = {
    backend: { id: 'backend', label: 'Backend & APIs', icon: 'bi-hdd-network', badgeClass: 'bg-primary-subtle text-primary' },
    funcional: { id: 'funcional', label: 'Analista Funcional', icon: 'bi-diagram-3', badgeClass: 'bg-info-subtle text-info' },
    datos: { id: 'datos', label: 'Datos & SQL', icon: 'bi-database', badgeClass: 'bg-warning-subtle text-warning' },
    qa: { id: 'qa', label: 'QA & Testing', icon: 'bi-shield-check', badgeClass: 'bg-success-subtle text-success' }
  };

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
    const target = this.filtroActivo.toLowerCase();
    return this.proyectos.filter(p => {
      if (p.categorias) {
        const cats = p.categorias.split(',').map(c => c.trim().toLowerCase());
        return cats.includes(target);
      }
      // Fallback para proyectos anteriores sin campo categorias
      const query = target;
      return (
        (p.nombre && p.nombre.toLowerCase().includes(query)) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(query))
      );
    });
  }

  getProjectCategories(proyecto: Proyecto): CategoryMeta[] {
    if (!proyecto.categorias) {
      return [];
    }
    const keys = proyecto.categorias.split(',').map(c => c.trim().toLowerCase());
    return keys
      .map(k => this.categoryMap[k])
      .filter(meta => !!meta);
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
        this.sProyecto.delete(id).subscribe({
          next: () => {
            this.cargarProyecto();
          },
          error: () => {
            alert("No se pudo borrar el proyecto");
          }
        });
      }
    }
  }
}
