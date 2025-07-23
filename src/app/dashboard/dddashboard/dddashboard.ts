import { Component, AfterViewInit, ViewChild, ElementRef, Injector, ComponentFactoryResolver, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import { GridStack, GridStackOptions, GridStackWidget } from 'gridstack';
import { CommonModule } from '@angular/common';
import { GraphComponent } from '../graph-component/graph-component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dddashboard',
  standalone: true,
  templateUrl: './dddashboard.html',
  styleUrls: ['./dddashboard.css'],
  imports: [CommonModule, GraphComponent, FormsModule]
})
export class DDdashboard implements AfterViewInit {
  activeTab: 'data' | 'design' = 'data';

  design = {
    bgColor: '#ffffff',
    textColor: '#000000',
    textAlign: 'left',
    fontFamily: 'Arial',
    fontSize: 16
  };
  imString: string = 'I m Developer'

  @ViewChild('gridContainer', { static: true }) gridContainer!: ElementRef;
  drawModeONN: boolean = true;
  private grid!: GridStack;


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) { }



  ngAfterViewInit(): void {
    const options: GridStackOptions = {
      cellHeight: 80,
      float: true,
      column: 12
    };

    // Initialize the grid
    this.grid = GridStack.init(options, this.gridContainer.nativeElement);

    // Create the widget container
    const el = document.createElement('div');
    el.classList.add('grid-stack-item');
    el.setAttribute('gs-x', '0');
    el.setAttribute('gs-y', '0');
    el.setAttribute('gs-w', '3');
    el.setAttribute('gs-h', '2');

    // Create the widget content
    const content = document.createElement('div');
    content.classList.add('grid-stack-item-content');
    content.innerHTML = `
    <div class="widget-toolbar">
      <button class="choose-data-btn">Choose Data</button>
      <button class="delete-widget-btn">🗑️</button>
    </div>
    <div class="widget-body">
      <app-graph-component [apple]=${this.imString}></app-graph-component>
      <p>Drop content here...</p>
    </div>
  `;

    // Append content to the element
    el.appendChild(content);

    // Add to grid
    this.grid.addWidget(el);

    // Optional: Attach events after widget is rendered
    setTimeout(() => {
      const chooseButton = el.querySelector('.choose-data-btn');
      const deleteButton = el.querySelector('.delete-widget-btn');

      if (chooseButton) {
        chooseButton.addEventListener('click', () => this.openDataPicker(el));
      }

      if (deleteButton) {
        deleteButton.addEventListener('click', () => {
          this.grid.removeWidget(el);
        });
      }
    });
  }

  addWidget(): void {
    const widget = document.createElement('div');
    widget.classList.add('grid-stack-item');
    widget.setAttribute('gs-x', '0');
    widget.setAttribute('gs-y', '0');
    widget.setAttribute('gs-w', '3');
    widget.setAttribute('gs-h', '2');

    const content = document.createElement('div');
    content.classList.add('grid-stack-item-content');

    const defaultStyle = {
      bgColor: 'white',
      textColor: 'black',
      textAlign: 'center',
      fontFamily: 'Arial',
      fontSize: '16px'
    };

    content.innerHTML = `
    <div class="completebox">
      <div class="widget-toolbar">
        <button class="choose-data-btn">Choose Data</button>
        <button class="delete-widget-btn">🗑️</button>
      </div>
      <div class="widget-body" style="
        background-color: ${defaultStyle.bgColor};
        color: ${defaultStyle.textColor};
        text-align: ${defaultStyle.textAlign};
        font-family: ${defaultStyle.fontFamily};
        font-size: ${defaultStyle.fontSize};
        display: flex; align-items: center; justify-content: center;
      ">
        <div class="component-placeholder"></div>
      </div>
    </div>
  `;

    widget.appendChild(content);
    this.gridContainer.nativeElement.appendChild(widget);
    this.grid.makeWidget(widget);

    // ✅ Inject Angular component
    const placeholder = widget.querySelector('.component-placeholder');
    if (placeholder) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(GraphComponent);
      const componentRef = factory.create(this.injector);
      //to define input variables 
      componentRef.instance.apple = this.imString;
      this.appRef.attachView(componentRef.hostView);
      placeholder.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
    }

    // Button event logic
    const btn = widget.querySelector('.choose-data-btn');
    if (btn) {
      btn.addEventListener('click', () => this.openDataPicker(widget));
    }

    const deleteBtn = widget.querySelector('.delete-widget-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.grid.removeWidget(widget);
      });
    }
  }




  saveLayout(): void {
    const widgets = this.grid.engine.nodes.map(node => {
      const el = node.el!;
      const contentEl = el.querySelector('.widget-body') as HTMLElement;
      const style = window.getComputedStyle(contentEl);

      const content = contentEl ? contentEl.innerHTML : '';

      return {
        x: node.x,
        y: node.y,
        w: node.w,
        h: node.h,
        content,
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
    console.log('Layout with content + style saved:', widgets);
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

        // Optional styling object (make sure it's saved in layout too)
        const style = item.style || {};

        content.innerHTML = `
        <div class="completebox">
          <div class="widget-toolbar">
            <button class="choose-data-btn">Choose Data</button>
          </div>
          <div class="widget-body" style="
            background-color: ${style.bgColor || 'white'};
            color: ${style.textColor || 'black'};
            text-align: ${style.textAlign || 'left'};
            font-family: ${style.fontFamily || 'Arial'};
            font-size: ${style.fontSize || '16px'};
            display: flex; align-items: center; justify-content: center;
          ">
            <!-- Dynamic component will be injected here -->
            <div class="component-placeholder"></div>
          </div>
        </div>
      `;

        widget.appendChild(content);
        this.gridContainer.nativeElement.appendChild(widget);
        this.grid.makeWidget(widget);

        // ✅ Inject Angular component dynamically
        const placeholder = widget.querySelector('.component-placeholder');
        if (placeholder) {
          const factory = this.componentFactoryResolver.resolveComponentFactory(GraphComponent);
          const componentRef = factory.create(this.injector);
          componentRef.instance.apple = this.imString; // 🔥 Inject your variable
          this.appRef.attachView(componentRef.hostView);
          placeholder.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
        }

        // Reattach Choose Data button logic
        setTimeout(() => {
          const btn = widget.querySelector('.choose-data-btn');
          if (btn) {
            btn.addEventListener('click', () => this.openDataPicker(widget));
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



  closeDataPicker(): void {
    this.showDataPicker = false;
    this.selectedWidgetEl = null;
  }

  tableKeys(): string[] {
    return Object.keys(this.templateInput.tables);
  }






  // data structure is here 
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



}
