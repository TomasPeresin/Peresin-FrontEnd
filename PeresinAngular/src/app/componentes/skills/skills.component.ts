import { Component, OnInit } from '@angular/core';
import { Hardysoft } from 'src/app/model/hardysoft';
import { SHysskillsService } from 'src/app/service/s-hysskills.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  skill: Hardysoft[] = [];

  constructor(private sSkill: SHysskillsService, private tokenService: TokenService){ }

  isLogged = false;

  ngOnInit(): void {
    this.cargarSkill();
    if (this.tokenService.getToken()){
      this.isLogged = true;
    }else{
      this.isLogged = false;
    }
  }

  cargarSkill():void{
    this.sSkill.lista().subscribe(data => {this.skill = data;} )
  }

  delete(id?:number){
    if(id != undefined){
      this.sSkill.delete(id).subscribe(data => {
        this.cargarSkill();
        }, err=> {
        alert("No se pudo borrar el skill");
        });
    }
  }
}

