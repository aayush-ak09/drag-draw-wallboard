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

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  templateUrl: './donut-chart.html',
  styleUrls: ['./donut-chart.css']
})
export class DonutChart implements AfterViewInit, OnDestroy {
  @ViewChild('donutCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() colors: string[] = [];

  chart!: Chart;
  resizeObserver!: ResizeObserver;

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
        maintainAspectRatio: false, // Key for resizing to parent box
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });

    // ✅ Observe size changes in parent container
    const parent = this.canvasRef.nativeElement.parentElement;
    if (parent) {
      this.resizeObserver = new ResizeObserver(() => {
        this.chart?.resize();
      });
      this.resizeObserver.observe(parent);
    }
  }

  ngOnDestroy(): void {
    // Clean up chart and observer
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
