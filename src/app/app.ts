import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DDdashboard } from './dashboard/dddashboard/dddashboard'

@Component({
  selector: 'app-root',
  imports: [DDdashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'drag-draw-wallboard';
}
