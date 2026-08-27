import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Experiencia } from 'src/app/model/experiencia';
import { SExperienciaService } from 'src/app/service/s-experiencia.service';

@Component({
  selector: 'app-new-experiencia',
  templateUrl: './new-experiencia.component.html',
  styleUrls: ['./new-experiencia.component.css'],
  standalone: false
})
export class NewExperienciaComponent implements OnInit {
  nombreE: string = '';
  descripcionE: string = '';
  fechaInicio: number = new Date().getFullYear() - 1;
  fechaFin: number = new Date().getFullYear();
  tecnologias: string = '';

  sugerencias: string[] = [
    'Java', 'Spring Boot', 'Spring Security', 'JPA / Hibernate',
    'MySQL', 'PostgreSQL', 'Docker', 'Postman', 'REST APIs',
    'Scrum / Agile', 'Git', 'Maven', 'UML / Historias de Usuario', 'QA Testing'
  ];

  constructor(private sExperiencia: SExperienciaService, private router: Router) {}

  ngOnInit(): void {}

  agregarSugerencia(sug: string): void {
    if (!this.tecnologias.trim()) {
      this.tecnologias = sug;
    } else {
      const items = this.tecnologias.split(',').map(t => t.trim());
      if (!items.includes(sug)) {
        this.tecnologias += ', ' + sug;
      }
    }
  }

  onCreate(): void {
    if (!this.nombreE.trim() || !this.descripcionE.trim()) {
      return;
    }
    const expe = new Experiencia(this.nombreE.trim(), this.descripcionE.trim(), this.fechaInicio, this.fechaFin, this.tecnologias.trim());
    this.sExperiencia.save(expe).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: () => {
        alert('Error al añadir la experiencia. Verifica los campos.');
      }
    });
  }
}
