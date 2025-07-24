import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  Chart,
  ChartType,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// ✅ Register the required chart elements/controllers
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [],
  templateUrl: './donut-chart.html',
  styleUrls: ['./donut-chart.css']  // ✅ fixed `styleUrls` instead of `styleUrl`
})
export class DonutChart implements AfterViewInit, OnDestroy {
  @ViewChild('donutCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() colors: string[] = [];

  chart!: Chart;

  ngAfterViewInit(): void {
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'doughnut' as ChartType,
      data: {
        labels: this.labels,
        datasets: [{
          data: this.values,
          backgroundColor: this.colors.length ? this.colors : ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
