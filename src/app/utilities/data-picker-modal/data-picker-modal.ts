import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DesignConfig } from '../../Services/interfaces';
@Component({
  selector: 'app-data-picker-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './data-picker-modal.html',
  styleUrl: './data-picker-modal.css',
  standalone: true
})
export class DataPickerModalComponent implements OnChanges {
  @Input() show: boolean = false;
  @Input() templateInput: any;
  @Input() chartTypes: { label: string, value: string }[] = [];
  @Input() design: DesignConfig = {};
  @Input() selectedStats: any[] = [];
  @Input() clocktype: string | null = null;

  @Output() designApplied = new EventEmitter<DesignConfig>();
  @Output() statsApplied = new EventEmitter<any[]>();
  @Output() tableSelected = new EventEmitter<string>();
  @Output() modalClosed = new EventEmitter<void>();
  @Output() chartSelected = new EventEmitter<string>();
  @Output() clockSelectedEvent = new EventEmitter<string>();

  activeTab: 'data' | 'design' = 'data';
  selectedWidgetType: string = '';
  showDataPicker: boolean = false;

  selectWidgetType(type: string): void {
    this.selectedWidgetType = type;
    this.showDataPicker=false;
  }

  widgetTypes = [
    { type: 'single-stat', label: '📊 Single Stat' },
    { type: 'multi-stat',  label: '📈 Multi Stat' },
    { type: 'chart',       label: '📉 Chart' },
    { type: 'graph',       label: '📌 Graph' },
    { type: 'table',       label: '📋 Table' },
    { type: 'logoHeader',  label: '🖼 Logo' },
    { type: 'widget',      label: '🔢 Widget' }
  ];

  clockSelected(type: string): void {
    this.design.chartType = type;
    this.applyChartSelection();
  }


  ngOnChanges(changes: SimpleChanges): void {
    // When the modal is opened, reset to the first step
    if (changes['show'] && this.show) {
      this.activeTab = 'data';
      // keep whatever was selected previously? If not, reset:
      // this.selectedStats = [...this.selectedStats]; // already an array
      // reset step 1 vs step 2 flow if needed
      if (!this.selectedWidgetType) {
        // stay on step 1
      }
    }
  }

  // Close handlers
  closeModal(): void {
    this.selectedWidgetType = '';
    this.modalClosed.emit();
  }

  closeDataPicker(): void {
    this.selectedWidgetType = '';
    this.modalClosed.emit();
  }

  // Data actions
  toggleStatSelection(stat: any): void {
    const index = this.selectedStats.findIndex(s => s[0] === stat[0] && s[1] === stat[1]);
    if (index >= 0) {
      this.selectedStats = this.selectedStats.filter((_, i) => i !== index);
    } else {
      this.selectedStats = [...this.selectedStats, stat];
    }
  }

  isStatSelected(stat: any): boolean {
    return this.selectedStats.some(s => s[0] === stat[0] && s[1] === stat[1]);
    // note: compare both tuple entries to avoid accidental collisions
  }

  applySelectedStats(): void {
    this.statsApplied.emit(this.selectedStats);
    this.closeDataPicker();
  }

  applyCustomDesign(): void {
    this.designApplied.emit(this.design);
    this.closeDataPicker();
  }

  applyChartSelection(): void {
    // emit the selected chart type from design
    this.chartSelected.emit(this.design.chartType);
  }

  selectedTable: string | null = null;

  selectTable(tableKey: string): void {
    this.selectedTable = tableKey;
    this.tableSelected.emit(tableKey);
    this.closeDataPicker();
  }

  tableKeys(): string[] {
    return this.templateInput ? Object.keys(this.templateInput?.tables || {}) : [];
  }
}
