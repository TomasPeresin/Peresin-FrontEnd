import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hardysoft } from 'src/app/model/hardysoft';
import { SHysskillsService } from 'src/app/service/s-hysskills.service';

@Component({
  selector: 'app-new-skills',
  templateUrl: './new-skills.component.html',
  styleUrls: ['./new-skills.component.css']
})
export class NewSkillsComponent implements OnInit{
  nombre: string='';
  porcentaje: number=null;

  constructor(private sSkills: SHysskillsService, private router: Router){

  }
  ngOnInit(): void {
  }

  onCreate(): void{
    const skills = new Hardysoft(this.nombre, this.porcentaje);
    this.sSkills.save(skills).subscribe(data =>{
      alert("Skill añadido"); 
      this.router.navigate(['']);
    }, err =>{
      alert("Skill fallo");
      this.router.navigate(['']);
    }
    )
  }
}