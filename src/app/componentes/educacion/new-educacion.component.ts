import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Educacion } from 'src/app/model/educacion';
import { SEducacionService } from 'src/app/service/s-educacion.service';

@Component({
  selector: 'app-new-educacion',
  templateUrl: './new-educacion.component.html',
  styleUrls: ['./new-educacion.component.css']
})
export class NewEducacionComponent implements OnInit{
  institucionE: String='';
  tituloE: String='';
  estadoE: String='';
  fechaInicio: number;
  fechaFin: number;

  constructor(private sEducacion: SEducacionService, private router: Router){

  }
  ngOnInit(): void {
  }

  onCreate(): void{
    const edu = new Educacion(this.institucionE,this.tituloE,this.estadoE,this.fechaInicio,this.fechaFin);
    this.sEducacion.save(edu).subscribe(data =>{
      alert("Educacion añadida"); 
      this.router.navigate(['']);
    }, err =>{
      alert("Educacion fallo");
      this.router.navigate(['']);
    }
    )
  }
}