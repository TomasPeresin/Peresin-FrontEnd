import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proyecto } from 'src/app/model/proyecto';
import { SProyectoService } from 'src/app/service/s-proyecto.service';

@Component({
  selector: 'app-new-proyectos',
  templateUrl: './new-proyectos.component.html',
  styleUrls: ['./new-proyectos.component.css']
})
export class NewProyectosComponent implements OnInit{
  nombre: String = '';
  descripcion: String = '';
  fecha: number = 0;
  link: String = '';

  constructor(private sProyecto: SProyectoService, private router: Router){}

  ngOnInit(): void {
  }

  onCreate(): void{
    const proyectos = new Proyecto(this.nombre, this.descripcion, this.fecha, this.link);
    this.sProyecto.save(proyectos).subscribe(data =>{
      alert("Proyecto añadido"); 
      this.router.navigate(['']);
    }, err =>{
      alert("Proyecto fallo");
      this.router.navigate(['']);
    }
    )
  }
}