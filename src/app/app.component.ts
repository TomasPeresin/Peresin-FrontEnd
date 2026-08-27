import { Component } from '@angular/core';
import AOS from 'aos';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'PeresinAngular';

  ngOnInit() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }
}
