import { Component, OnInit } from '@angular/core';
import { persona } from 'src/app/model/persona.model';
import { PersonaService } from 'src/app/service/persona.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css'],
  standalone: false
})
export class AcercaDeComponent implements OnInit {
  persona: persona = new persona('', '', '', '', '');
  isLogged: boolean = false;

  constructor(
    public personaService: PersonaService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.personaService.getPersonas().subscribe(data => {
      if (data) {
        this.persona = data;
      }
    });
  }
}
