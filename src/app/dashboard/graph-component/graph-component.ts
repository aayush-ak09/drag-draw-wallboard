import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-graph-component',
  imports: [],
  templateUrl: './graph-component.html',
  styleUrl: './graph-component.css'
})
export class GraphComponent {
  @Input() apple!: string;

}
