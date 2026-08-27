import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hardysoft } from 'src/app/model/hardysoft';
import { SHysskillsService } from 'src/app/service/s-hysskills.service';

@Component({
  selector: 'app-new-skills',
  templateUrl: './new-skills.component.html',
  styleUrls: ['./new-skills.component.css'],
  standalone: false
})
export class NewSkillsComponent implements OnInit {
  nombre: string = '';
  porcentaje: number = 100;

  sugerencias: string[] = [
    'Docker', 'Postman', 'Git / GitHub', 'Microservicios', 
    'JWT & Security', 'JUnit & Mockito', 'PostgreSQL', 
    'Linux', 'Scrum / Agile', 'Jira', 'Swagger / OpenAPI'
  ];

  constructor(private sSkills: SHysskillsService, private router: Router) {}

  ngOnInit(): void {}

  seleccionarSugerencia(sug: string): void {
    this.nombre = sug;
  }

  onCreate(): void {
    if (!this.nombre.trim()) {
      return;
    }
    const skills = new Hardysoft(this.nombre.trim(), this.porcentaje || 100);
    this.sSkills.save(skills).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (err) => {
        alert('Hubo un error al guardar la habilidad.');
      }
    });
  }
}