import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Experiencia } from 'src/app/model/experiencia';
import { SExperienciaService } from 'src/app/service/s-experiencia.service';

@Component({
  selector: 'app-edit-experiencia',
  templateUrl: './edit-experiencia.component.html',
  styleUrls: ['./edit-experiencia.component.css'],
  standalone: false
})
export class EditExperienciaComponent implements OnInit {
  expLab: Experiencia = null;

  sugerencias: string[] = [
    'Java', 'Spring Boot', 'Spring Security', 'JPA / Hibernate',
    'MySQL', 'PostgreSQL', 'Docker', 'Postman', 'REST APIs',
    'Scrum / Agile', 'Git', 'Maven', 'UML / Historias de Usuario', 'QA Testing'
  ];

  constructor(
    private sExperiencia: SExperienciaService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id'];
    this.sExperiencia.detail(id).subscribe({
      next: (data) => {
        this.expLab = data;
      },
      error: () => {
        alert('Error al cargar la experiencia.');
        this.router.navigate(['']);
      }
    });
  }

  agregarSugerencia(sug: string): void {
    if (!this.expLab) return;
    if (!this.expLab.tecnologias || !this.expLab.tecnologias.trim()) {
      this.expLab.tecnologias = sug;
    } else {
      const items = this.expLab.tecnologias.split(',').map(t => t.trim());
      if (!items.includes(sug)) {
        this.expLab.tecnologias += ', ' + sug;
      }
    }
  }

  onUpdate(): void {
    const id = this.activatedRouter.snapshot.params['id'];
    this.sExperiencia.update(id, this.expLab).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: () => {
        alert('Error al modificar experiencia.');
        this.router.navigate(['']);
      }
    });
  }
}
