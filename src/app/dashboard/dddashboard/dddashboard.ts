import { Component, AfterViewInit, ViewChild, ElementRef, inject, ViewContainerRef, HostListener } from '@angular/core';
import { GridStack, GridStackOptions, GridStackWidget } from 'gridstack';
import { CommonModule } from '@angular/common';
import { GraphComponent } from '../graph-component/graph-component';
import { FormsModule } from '@angular/forms';
import { DonutChart } from '../../components/donut-chart/donut-chart';
import { GaugeChartComponent } from '../../components/gauge-chart/gauge-chart';
import { JoyBigGaugeChartComponent } from '../../components/joy-big-gauge/joy-big-gauge-chart.component';
import { Barchart } from '../../components/barchart/barchart';
import { PredefinedLayout} from '../../Serveices/layouts'

@Component({
  selector: 'app-dddashboard',
  standalone: true,
  templateUrl: './dddashboard.html',
  styleUrls: ['./dddashboard.css'],
  imports: [CommonModule, FormsModule]
})

export class DDdashboard implements AfterViewInit {
  activeTab: 'data' | 'design' = 'data';

  design = {
    bgColor: '#ffffff',
    textColor: '#000000',
    textAlign: 'left',
    fontFamily: 'Arial',
    fontSize: 16,
    chartType: 'donut',
    layoutDirection: 'vertical' // or 'horizontal'
  };

  chartTypes = [
    { value: 'donut', label: 'Donut Chart' },
    { value: 'gauge', label: 'Simple Gauge' },
    { value: 'biggauge', label: 'Big Gauge' },
    { value: 'barchart', label: 'Bar Graph' }
  ];

  @ViewChild('gridContainer', { static: true }) gridContainer!: ElementRef;
  drawModeONN: boolean = true;
  private grid!: GridStack;
  private viewContainerRef = inject(ViewContainerRef);

  selectedStats: [string, string][] = [];


  ngAfterViewInit(): void {

    const totalRows = 48;

    const topBarHeight = document.querySelector('.control-center')?.clientHeight || 0;
    const verticalMargins = 16;
    const availableHeight = window.innerHeight - topBarHeight - verticalMargins;

    const dynamicCellHeight = Math.floor(availableHeight / totalRows);

    const options: GridStackOptions = {
      cellHeight: dynamicCellHeight + 'px',
      float: true,
      column: 48,
      margin: 5,
    };

    this.grid = GridStack.init(options, this.gridContainer.nativeElement);

    const el = document.createElement('div');
    el.classList.add('grid-stack-item');
    el.setAttribute('gs-x', '0');
    el.setAttribute('gs-y', '0');
    el.setAttribute('gs-w', '12');
    el.setAttribute('gs-h', '8');

    const content = document.createElement('div');
    content.classList.add('grid-stack-item-content');

    const toolbar = document.createElement('div');
    toolbar.className = 'widget-toolbar';
    toolbar.innerHTML = `
    <button class="choose-data-btn">Choose Data</button>
    <button class="delete-widget-btn">🗑️</button>
  `;

    const body = document.createElement('div');
    body.className = 'widget-body';
    body.style.padding = '10px';

    // Dynamically inject GraphComponent
    const compRef = this.viewContainerRef.createComponent(GraphComponent);
    compRef.instance.name = '🛈 Click “Choose Data” to configure this widget.';
    body.appendChild(compRef.location.nativeElement);

    content.appendChild(toolbar);
    content.appendChild(body);
    el.appendChild(content);
    this.grid.makeWidget(el);

    setTimeout(() => {
      const chooseButton = el.querySelector('.choose-data-btn');
      const deleteButton = el.querySelector('.delete-widget-btn');

      if (chooseButton) {
        chooseButton.addEventListener('click', () => this.openDataPicker(el));
      }
      if (deleteButton) {
        deleteButton.addEventListener('click', () => this.grid.removeWidget(el));
      }
    });
  }


  addWidget(): void {
    const widget = document.createElement('div');
    widget.classList.add('grid-stack-item');
    widget.setAttribute('gs-x', '0');
    widget.setAttribute('gs-y', '0');
    widget.setAttribute('gs-w', '12');
    widget.setAttribute('gs-h', '8');

    const content = document.createElement('div');
    content.classList.add('grid-stack-item-content');

    const toolbar = document.createElement('div');
    toolbar.className = 'widget-toolbar';
    toolbar.innerHTML = `
    <button class="choose-data-btn">Choose Data</button>
    <button class="delete-widget-btn">🗑️</button>
  `;

    const body = document.createElement('div');
    body.className = 'widget-body';
    body.style.padding = '10px';

    const compRef = this.viewContainerRef.createComponent(GraphComponent);
    compRef.instance.name = '🛈 Click “Choose Data” to configure this widget.';
    body.appendChild(compRef.location.nativeElement);

    content.appendChild(toolbar);
    content.appendChild(body);
    widget.appendChild(content);
    this.gridContainer.nativeElement.appendChild(widget);
    this.grid.makeWidget(widget);

    setTimeout(() => {
      const chooseButton = widget.querySelector('.choose-data-btn');
      const deleteButton = widget.querySelector('.delete-widget-btn');

      if (chooseButton) {
        chooseButton.addEventListener('click', () => this.openDataPicker(widget));
      }
      if (deleteButton) {
        deleteButton.addEventListener('click', () => widget.remove());
      }
    });
  }


  saveLayout(): void {
    const widgets = this.grid.engine.nodes.map(node => {
      const el = node.el!;
      const bodyEl = el.querySelector('.widget-body') as HTMLElement;
      const style = window.getComputedStyle(bodyEl);

      const chartType = bodyEl.dataset['chartType'] || 'text';
      const chartConfigRaw = bodyEl.dataset['chartConfig'];
      const config = chartConfigRaw ? JSON.parse(chartConfigRaw) : {};

      return {
        x: node.x,
        y: node.y,
        w: node.w,
        h: node.h,
        chartType,
        config,
        style: {
          bgColor: style.backgroundColor,
          textColor: style.color,
          textAlign: style.textAlign,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize
        }
      };
    });

    localStorage.setItem('my-dashboard-layout', JSON.stringify(widgets));
    console.log('Layout saved:', widgets);
  }


  showLayout(): void {
    this.drawModeONN = false;
    this.grid.removeAll(false);
    this.loadLayout();
  }


  loadLayout(): void {
    const raw = localStorage.getItem('my-dashboard-layout');
    if (raw) {
      const widgets = JSON.parse(raw);
      this.grid.removeAll(false);

      widgets.forEach((item: any) => {
        const widget = document.createElement('div');
        widget.classList.add('grid-stack-item');
        widget.setAttribute('gs-x', item.x);
        widget.setAttribute('gs-y', item.y);
        widget.setAttribute('gs-w', item.w);
        widget.setAttribute('gs-h', item.h);

        const content = document.createElement('div');
        content.classList.add('grid-stack-item-content');

        const toolbar = document.createElement('div');
        // In preview mode, no toolbar is needed.
        // You can add it back if you want to allow edits.

        const body = document.createElement('div');
        body.className = 'widget-body';
        Object.assign(body.style, {
          backgroundColor: item.style.bgColor,
          color: item.style.textColor,
          textAlign: item.style.textAlign as CanvasTextAlign,
          fontFamily: item.style.fontFamily,
          fontSize: item.style.fontSize
        });

        // Set metadata for potential future edits
        body.dataset['chartType'] = item.chartType;
        body.dataset['chartConfig'] = JSON.stringify(item.config || {});

        let compRef: any;
        const config = item.config || {};

        switch (item.chartType) {
          case 'donut':
            compRef = this.viewContainerRef.createComponent(DonutChart);
            compRef.instance.labels = config.labels || ['A', 'B', 'C'];
            compRef.instance.values = config.values || [50, 30, 20];
            compRef.instance.colors = config.colors || ['#FF6384', '#36A2EB', '#FFCE56'];
            break;

          case 'gauge':
            compRef = this.viewContainerRef.createComponent(GaugeChartComponent);
            compRef.instance.value = config.value || 0;
            compRef.instance.label = config.label || 'Gauge';
            break;

          case 'biggauge':
            compRef = this.viewContainerRef.createComponent(JoyBigGaugeChartComponent);
            compRef.instance.value = config.value || 0;
            compRef.instance.header_text = config.header_text || 'Title';
            break;

          case 'barchart':
            compRef = this.viewContainerRef.createComponent(Barchart);
            compRef.instance.labels = config.labels || ['Q1', 'Q2', 'Q3', 'Q4'];
            compRef.instance.values = config.values || [120, 150, 180, 200];
            compRef.instance.colors = config.colors || ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9'];
            break;

          default:
            if (item.config?.stats?.length) {
              body.innerHTML = item.config.stats
                .map((stat: [string, string]) => `
                <div class="stat-block">
                  <h4>${stat[0]}</h4>
                  <p>${stat[1]}</p>
                </div>
              `)
                .join('');

              // Apply saved layout styling
              Object.assign(body.style, {
                display: 'flex',
                flexDirection: item.config.layoutDirection, // This is the crucial fix
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                justifyContent: item.config.layoutDirection === 'row' ? 'space-between' : 'flex-start'
              });

            } else {
              body.innerHTML = '<p>No content available</p>';
            }
            break;
        }

        if (compRef) {
          body.appendChild(compRef.location.nativeElement);
        }

        content.appendChild(toolbar);
        content.appendChild(body);
        widget.appendChild(content);
        this.gridContainer.nativeElement.appendChild(widget);
        this.grid.makeWidget(widget);

        setTimeout(() => {
          const chooseButton = widget.querySelector('.choose-data-btn');
          if (chooseButton) {
            chooseButton.addEventListener('click', () => this.openDataPicker(widget));
          }
        });
      });
    }
  }




  selectedWidgetEl: HTMLElement | null = null;
  showDataPicker = false;

  openDataPicker(widgetEl: HTMLElement): void {
    this.selectedWidgetEl = widgetEl;
    this.showDataPicker = true;
  }

  deleteLayout(): void {
    const confirmed = confirm('Are you sure you want to delete this layout?');
    if (confirmed) {
      localStorage.removeItem('my-dashboard-layout');
      this.grid.removeAll(false);
      console.log('Layout deleted.');
    }
  }



  selectStat(stat: [string, string]) {
    if (this.selectedWidgetEl) {
      const body = this.selectedWidgetEl.querySelector('.widget-body');
      if (body) {
        body.innerHTML = `<h4>${stat[0]}</h4><p>${stat[1]}</p>`;
      }
    }
    this.closeDataPicker();
  }

  selectTable(tableKey: string) {
    const tableData = this.templateInput.tables[tableKey];
    if (this.selectedWidgetEl && tableData) {
      const body = this.selectedWidgetEl.querySelector('.widget-body');
      if (body) {
        const headers = Object.keys(tableData[0]);

        const headerRow = headers.map(h => `<th>${h}</th>`).join('');
        const rows = tableData
          .map((row: { [key: string]: any }) =>
            `<tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>`
          )
          .join('');

        const tableHTML = `
        <table style="width:100%; border-collapse: collapse;" border="1">
          <thead><tr>${headerRow}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
        body.innerHTML = tableHTML;
      }
    } else {
      console.warn('No data found for table:', tableKey);
    }

    this.closeDataPicker();
  }

  applyChartSelection(): void {
    if (!this.selectedWidgetEl) return;

    const widgetEl = this.selectedWidgetEl;
    const body = widgetEl.querySelector('.widget-body') as HTMLElement;

    if (!body) return;

    // Clear existing content
    body.innerHTML = '';

    let compRef: any;
    let config: any = {};
    let width = 12;
    let height = 18;

    switch (this.design.chartType) {
      case 'donut':
        compRef = this.viewContainerRef.createComponent(DonutChart);
        config = {
          labels: ['A', 'B', 'C'],
          values: [50, 30, 20],
          colors: ['#FF6384', '#36A2EB', '#FFCE56']
        };
        compRef.instance.labels = config.labels;
        compRef.instance.values = config.values;
        compRef.instance.colors = config.colors;
        break;

      case 'gauge':
        compRef = this.viewContainerRef.createComponent(GaugeChartComponent);
        config = {
          value: 65,
          label: 'Performance'
        };
        compRef.instance.value = config.value;
        compRef.instance.label = config.label;
        width = 8;
        height = 16;
        break;

      case 'biggauge':
        compRef = this.viewContainerRef.createComponent(JoyBigGaugeChartComponent);
        config = {
          value: 72,
          header_text: 'Service Level'
        };
        compRef.instance.value = config.value;
        compRef.instance.header_text = config.header_text;
        width = 16;
        height = 24;
        break;

      case 'barchart':
        compRef = this.viewContainerRef.createComponent(Barchart);
        config = {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          values: [120, 150, 180, 200],
          colors: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9']
        };
        compRef.instance.labels = config.labels;
        compRef.instance.values = config.values;
        compRef.instance.colors = config.colors;
        break;

      default:
        body.innerHTML = '<p>Unsupported chart type</p>';
        return;
    }

    if (compRef) {
      body.appendChild(compRef.location.nativeElement);

      // Save metadata for restoring layout later
      body.dataset['chartType'] = this.design.chartType;
      body.dataset['chartConfig'] = JSON.stringify(config);

      // Dynamically update widget size
      this.grid.update(widgetEl, { w: width, h: height });
    }

    this.closeDataPicker();
  }




  closeDataPicker(): void {
    this.showDataPicker = false;
    this.selectedWidgetEl = null;
  }

  tableKeys(): string[] {
    return Object.keys(this.templateInput.tables);
  }

  // data structure is here 
  applyCustomDesign(): void {
    if (this.selectedWidgetEl) {
      const body = this.selectedWidgetEl.querySelector('.widget-body') as HTMLElement;
      if (body) {
        body.style.backgroundColor = this.design.bgColor;
        body.style.color = this.design.textColor;
        body.style.textAlign = this.design.textAlign as CanvasTextAlign;
        body.style.fontFamily = this.design.fontFamily;
        body.style.fontSize = `${this.design.fontSize}px`;
      }
    }
  }


  toggleStatSelection(stat: [string, string]): void {
    const index = this.selectedStats.findIndex(
      s => s[0] === stat[0] && s[1] === stat[1]
    );
    if (index !== -1) {
      this.selectedStats.splice(index, 1);
    } else {
      this.selectedStats.push(stat);
    }
  }

  isStatSelected(stat: [string, string]): boolean {
    return this.selectedStats.some(
      s => s[0] === stat[0] && s[1] === stat[1]
    );
  }
  applySelectedStats(): void {
    if (this.selectedWidgetEl && this.selectedStats.length > 0) {
      const widgetEl = this.selectedWidgetEl;
      const body = widgetEl.querySelector('.widget-body') as HTMLElement;
      const toolbar = widgetEl.querySelector('.widget-toolbar') as HTMLElement;

      if (body) {
        // Clear existing content and render stat blocks
        body.innerHTML = this.selectedStats
          .map(stat => `
          <div class="stat-block">
            <h4>${stat[0]}</h4>
            <p>${stat[1]}</p>
          </div>
        `).join('');

        // Save config with the correct layout direction
        body.dataset['chartType'] = 'text';
        body.dataset['chartConfig'] = JSON.stringify({
          stats: this.selectedStats,
          layoutDirection: this.design.layoutDirection // This will be 'row' or 'column'
        });

        // Apply layout styling
        Object.assign(body.style, {
          display: 'flex',
          flexDirection: this.design.layoutDirection === 'horizontal' ? 'row' : 'column',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: this.design.layoutDirection === 'horizontal' ? 'space-between' : 'flex-start'
        });

        // Get grid cell height
        let cellHeight = 14.75;
        const gridEl = document.querySelector('.grid-stack') as HTMLElement;
        if (gridEl) {
          const raw = getComputedStyle(gridEl).getPropertyValue('--gs-cell-height');
          const parsed = parseFloat(raw.replace('px', '').trim());
          if (!isNaN(parsed)) cellHeight = parsed;
        }

        // Auto width & height
        const statCount = this.selectedStats.length;
        let w = 5;
        let h = 4;

        if (this.design.layoutDirection === 'horizontal') {
          w = Math.min(6 * statCount, 24);
        } else { // 'column'
          w = 5;
        }

        // Adjust height for both layouts based on content
        const contentHeight = body.scrollHeight + (toolbar?.offsetHeight || 0) + 20;
        h = Math.ceil(contentHeight / cellHeight);

        this.grid.update(widgetEl, { w, h });
      }
    }

    this.selectedStats = [];
    this.closeDataPicker();
  }


  @HostListener('window:resize')
  onResize() {
    const topBarHeight = document.querySelector('.control-center')?.clientHeight || 0;
    const verticalMargins = 16;
    const availableHeight = window.innerHeight - topBarHeight - verticalMargins;
    const newCellHeight = Math.floor(availableHeight / 48);
    this.grid.cellHeight(newCellHeight);
  }



  predefLayouts(){

  }

  templateInput: any = {
    Stats: [
      ['Revenue', '$120K'],
      ['Users', '5,200'],
      ['Bounce Rate', '42%'],
      ['Conversion Rate', '6.3%'],
      ['Avg. Session Time', '3m 24s'],
      ['Page Views', '18,000'],
      ['Signups', '1,230'],
      ['Downloads', '3,400'],
      ['Churn Rate', '5.1%'],
      ['Net Promoter Score', '67']
    ],
    tables: {
      table1: [
        { ID: 1, Name: 'John', Age: 28, Email: 'john@x.com', Country: 'USA' },
        { ID: 2, Name: 'Jane', Age: 34, Email: 'jane@x.com', Country: 'UK' },
        { ID: 3, Name: 'Ali', Age: 30, Email: 'ali@x.com', Country: 'UAE' },
        { ID: 4, Name: 'Maria', Age: 25, Email: 'maria@x.com', Country: 'Italy' },
        { ID: 5, Name: 'Chen', Age: 32, Email: 'chen@x.com', Country: 'China' },
        { ID: 6, Name: 'Carlos', Age: 29, Email: 'carlos@x.com', Country: 'Spain' },
        { ID: 7, Name: 'Raj', Age: 27, Email: 'raj@x.com', Country: 'India' },
        { ID: 8, Name: 'Anna', Age: 35, Email: 'anna@x.com', Country: 'Germany' },
        { ID: 9, Name: 'Emily', Age: 31, Email: 'emily@x.com', Country: 'Australia' },
        { ID: 10, Name: 'Sarah', Age: 26, Email: 'sarah@x.com', Country: 'Korea' }
      ],
      table2: [
        { ID: 1, Name: 'Laptop', Category: 'Electronics', Price: '$999', Stock: 50, Sold: 35, Rating: 4.5 },
        { ID: 2, Name: 'Chair', Category: 'Furniture', Price: '$120', Stock: 150, Sold: 70, Rating: 4.2 },
        { ID: 3, Name: 'Watch', Category: 'Accessories', Price: '$199', Stock: 85, Sold: 40, Rating: 4.7 },
        { ID: 4, Name: 'Shoes', Category: 'Apparel', Price: '$89', Stock: 200, Sold: 110, Rating: 4.3 },
        { ID: 5, Name: 'Book', Category: 'Stationery', Price: '$15', Stock: 300, Sold: 220, Rating: 4.8 }
      ],
      table3: [
        { Day: 'Monday', Visitors: 1200, Sales: 340, Revenue: '$4.5K', Returns: 5 },
        { Day: 'Tuesday', Visitors: 980, Sales: 280, Revenue: '$3.9K', Returns: 3 },
        { Day: 'Wednesday', Visitors: 1100, Sales: 310, Revenue: '$4.1K', Returns: 4 },
        { Day: 'Thursday', Visitors: 1250, Sales: 370, Revenue: '$5.2K', Returns: 2 },
        { Day: 'Friday', Visitors: 1400, Sales: 390, Revenue: '$5.8K', Returns: 1 }
      ]
    }
  };
}