import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DesignConfig } from '../../Services/interfaces'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-data-picker-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './data-picker-modal.html',
  styleUrl: './data-picker-modal.css',
})
export class DataPickerModalComponent {
  @Input() showDataPicker: boolean = false;
  @Input() templateInput: any;
  @Input() chartTypes: { label: string, value: string }[] = [];
  @Input() design: DesignConfig = {};
  @Input() selectedStats: any[] = [];

  @Output() designApplied = new EventEmitter<DesignConfig>();
  @Output() statsApplied = new EventEmitter<any[]>();
  @Output() tableSelected = new EventEmitter<string>();
  @Output() modalClosed = new EventEmitter<void>();
  @Output() chartSelected = new EventEmitter<string>();

  activeTab: 'data' | 'design' = 'data';

  toggleStatSelection(stat: any): void {
    const index = this.selectedStats.findIndex(s => s[0] === stat[0]);
    if (index >= 0) {
      this.selectedStats.splice(index, 1);
    } else {
      this.selectedStats.push(stat);
    }
  }

  isStatSelected(stat: any): boolean {
    return this.selectedStats.some(s => s[0] === stat[0]);
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
    this.chartSelected.emit(this.design.chartType); // emit the selected chartType
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

  closeDataPicker(): void {
    this.modalClosed.emit();
  }
}
