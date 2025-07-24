import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  ChartComponent,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  ApexFill,
  ApexDataLabels,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  labels: string[];
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.html',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
})
export class GaugeChartComponent {
  public chartOptions!: ChartOptions;
  @Input() value!: number;
  @Input() label!: string;
  @ViewChild(ChartComponent) chartComponent!: ChartComponent;

  ngOnInit(): void {
    setTimeout(() => {
      this.chartOptions = {
        series: [this.value],
        chart: {
          type: 'radialBar',
          height: '100%',
          width: '100%',
          sparkline: { enabled: true },
        },
        plotOptions: {
          radialBar: {
            hollow: { size: '70%' },
            track: {
              background: '#e7e7e7',
              strokeWidth: '97%',
              margin: 5,
            },
            dataLabels: {
              name: { show: true, fontSize: '16px' },
              value: {
                fontSize: '24px',
                show: true,
                formatter: (val) => `${val}%`,
              },
            },
          },
        },
        dataLabels: {
          enabled: true,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            gradientToColors: ['#ABE5A1'],
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: 'round',
        },
        labels: [this.label],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: { height: 200 },
              plotOptions: {
                radialBar: {
                  dataLabels: {
                    value: { fontSize: '16px' },
                  },
                },
              },
            },
          },
        ],
      };
    }, 500);
  }
}
