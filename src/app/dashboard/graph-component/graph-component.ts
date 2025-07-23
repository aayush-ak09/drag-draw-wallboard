import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-graph-component',
  standalone:true,
  imports: [],
  templateUrl: './graph-component.html',
  styleUrl: './graph-component.css'
})
export class GraphComponent {
  @Input()  apple:string='';

}
