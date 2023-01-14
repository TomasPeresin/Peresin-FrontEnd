import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hardysoft } from 'src/app/model/hardysoft';
import { SHysskillsService } from 'src/app/service/s-hysskills.service';

@Component({
  selector: 'app-edit-skill',
  templateUrl: './edit-skill.component.html',
  styleUrls: ['./edit-skill.component.css']
})
export class EditSkillComponent implements OnInit{
  skillLab: Hardysoft = null;
  constructor(private sSkill: SHysskillsService, private activatedRouter: ActivatedRoute, private router: Router){
  }
  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id'];
    this.sSkill.detail(id).subscribe(data =>{
        this.skillLab = data;
      }, err =>{
        alert("Error al modificar skill");
        this.router.navigate(['']);
      }
    )
  }

  onUpdate(): void{
    const id = this.activatedRouter.snapshot.params['id'];
    this.sSkill.update(id, this.skillLab).subscribe(data =>{
      this.router.navigate(['']);
      }, err =>{
        alert("Error al modificar skill");
        this.router.navigate(['']);
      }
    )
  }
}
