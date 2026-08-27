import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proyecto } from 'src/app/model/proyecto';
import { SProyectoService } from 'src/app/service/s-proyecto.service';

@Component({
    selector: 'app-new-proyectos',
    templateUrl: './new-proyectos.component.html',
    styleUrls: ['./new-proyectos.component.css'],
    standalone: false
})
export class NewProyectosComponent implements OnInit {
  nombre: string = '';
  descripcion: string = '';
  fecha: number = new Date().getFullYear();
  link: string = '';
  img: string = '';

  constructor(private sProyecto: SProyectoService, private router: Router) {}

  ngOnInit(): void {}

  onCreate(): void {
    const proyecto = new Proyecto(this.nombre, this.descripcion, this.fecha, this.link, this.img);
    this.sProyecto.save(proyecto).subscribe(
      data => {
        alert("Proyecto añadido correctamente");
        this.router.navigate(['']);
      },
      err => {
        alert("Error al añadir el proyecto. Verifica los campos.");
      }
    );
  }
}