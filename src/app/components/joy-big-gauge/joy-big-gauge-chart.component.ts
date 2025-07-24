import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5radar from '@amcharts/amcharts5/radar';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-joy-big-gauge-chart',
  templateUrl: './joy-big-gauge-chart.component.html',
  styleUrls: ['./joy-big-gauge-chart.component.css'],
  standalone: true,
})
export class JoyBigGaugeChartComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() header_text: string = 'Service Level';
  @Input() text_color: any = { color: 'white' };
  @Input() value: number = 0;

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  public chartId = `chartdiv-${Math.random().toString(36).substring(2, 9)}`;

  private root?: am5.Root;
  private axisDataItem?: any;
  private clockHand?: am5radar.ClockHand;

  constructor() {}

  ngAfterViewInit(): void {
    this.root = am5.Root.new(this.chartContainer.nativeElement);
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    const chart = this.root.container.children.push(
      am5radar.RadarChart.new(this.root, {
        panX: false,
        panY: false,
        startAngle: 160,
        endAngle: 380,
      })
    );

    const screenWidth = window.innerWidth;
    const breakpoints = [
      { width: 3840, innerRadius: -60 },
      { width: 1920, innerRadius: -50 },
      { width: 1280, innerRadius: -40 },
    ];
    const innerRadius =
      breakpoints.find((bp) => screenWidth >= bp.width)?.innerRadius ?? -40;

    const axisRenderer = am5radar.AxisRendererCircular.new(this.root, {
      innerRadius,
    });

    axisRenderer.grid.template.setAll({
      stroke: this.root.interfaceColors.get('background'),
      visible: true,
      strokeOpacity: 0.8,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(this.root, {
        maxDeviation: 0,
        min: 0,
        max: 100,
        strictMinMax: true,
        renderer: axisRenderer,
      })
    );

    this.axisDataItem = xAxis.makeDataItem({});
    this.clockHand = am5radar.ClockHand.new(this.root, {
      pinRadius: am5.percent(20),
      radius: am5.percent(100),
      bottomWidth: 40,
    });

    this.axisDataItem.set(
      'bullet',
      am5xy.AxisBullet.new(this.root, {
        sprite: this.clockHand,
      })
    );

    xAxis.createAxisRange(this.axisDataItem);
    this.axisDataItem.set('value', this.value);

    chart.bulletsContainer.set('mask', undefined);

    const bandsData = [
      { title: 'Low', color: '#ee1f25', lowScore: 0, highScore: 10 },
      { color: '#f04922', lowScore: 10, highScore: 30 },
      { color: '#fdae19', lowScore: 30, highScore: 50 },
      { color: '#f3eb0c', lowScore: 50, highScore: 70 },
      { color: '#b0d136', lowScore: 70, highScore: 90 },
      { title: 'High', color: '#0f9747', lowScore: 90, highScore: 100 },
    ];

    am5.array.each(bandsData, (data) => {
      const axisRange = xAxis.createAxisRange(
        xAxis.makeDataItem({ value: data.lowScore, endValue: data.highScore })
      );

      axisRange.get('axisFill')!.setAll({
        visible: true,
        fill: am5.color(data.color),
        fillOpacity: 0.8,
      });

      if (data.title) {
        axisRange.get('label')!.setAll({
          text: data.title,
          inside: true,
          fontSize: '1.25rem',
          fill: this.root!.interfaceColors.get('background'),
        });
      }
    });

    chart.appear(0, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.axisDataItem && this.clockHand) {
      this.axisDataItem.animate({
        key: 'value',
        to: this.value,
        duration: 500,
        easing: am5.ease.out(am5.ease.cubic),
      });

      setTimeout(() => {
        this.updateNeedleColor(this.value);
      }, 600);
    }
  }

  private updateNeedleColor(value: number): void {
    if (!this.clockHand || !this.root) return;

    const chart = this.root.container.children.getIndex(0) as am5radar.RadarChart;
    const xAxis = chart.xAxes.getIndex(0);

    let fill = am5.color(0x000000);
    xAxis?.axisRanges.each((axisRange: any) => {
      if (
        value >= axisRange.get('value')! &&
        value <= axisRange.get('endValue')!
      ) {
        fill = axisRange.get('axisFill')!.get('fill')!;
      }
    });

    this.clockHand.pin.setAll({ fill });
    this.clockHand.hand.setAll({ fill });
  }

  ngOnDestroy(): void {
    this.root?.dispose();
  }
}
