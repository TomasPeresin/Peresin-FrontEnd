import { Component } from '@angular/core';

@Component({
    selector: 'app-pie',
    templateUrl: './pie.component.html',
    styleUrls: ['./pie.component.css'],
    standalone: false
})
export class PieComponent {
  anioActual: number = new Date().getFullYear();
}
