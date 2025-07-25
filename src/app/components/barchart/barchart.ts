import { Component,Input,ViewChild,ElementRef,AfterViewInit,OnDestroy } from '@angular/core';
import { Chart, ChartType, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-barchart',
  standalone: true,
  templateUrl: './barchart.html',
  styleUrls: ['./barchart.css']
})
export class Barchart implements AfterViewInit, OnDestroy {
  @ViewChild('barCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() colors: string[] = [];

  chart!: Chart;
  resizeObserver!: ResizeObserver;

  ngAfterViewInit(): void {
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar' as ChartType,
      data: {
        labels: this.labels,
        datasets: [{
          data: this.values,
          backgroundColor: this.colors.length ? this.colors : ['#42A5F5', '#66BB6A', '#FFA726']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });

    const parent = this.canvasRef.nativeElement.parentElement;
    if (parent) {
      this.resizeObserver = new ResizeObserver(() => {
        this.chart?.resize();
      });
      this.resizeObserver.observe(parent);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
