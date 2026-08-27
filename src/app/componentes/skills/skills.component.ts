import { Component, OnInit } from '@angular/core';
import { Hardysoft } from 'src/app/model/hardysoft';
import { SHysskillsService } from 'src/app/service/s-hysskills.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
    selector: 'app-skills',
    templateUrl: './skills.component.html',
    styleUrls: ['./skills.component.css'],
    standalone: false
})
export class SkillsComponent implements OnInit {
  skill: Hardysoft[] = [];
  isLogged = false;

  constructor(private sSkill: SHysskillsService, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.cargarSkill();
    this.isLogged = !!this.tokenService.getToken();
  }

  cargarSkill(): void {
    this.sSkill.lista().subscribe(data => {
      this.skill = data;
    });
  }

  delete(id?: number): void {
    if (id != undefined) {
      if (confirm("¿Estás seguro de que deseas eliminar esta habilidad?")) {
        this.sSkill.delete(id).subscribe(
          data => {
            this.cargarSkill();
          },
          err => {
            alert("No se pudo borrar la habilidad");
          }
        );
      }
    }
  }
}
