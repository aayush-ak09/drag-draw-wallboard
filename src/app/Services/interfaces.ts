import { Injectable } from '@angular/core';

export interface DesignConfig {
  chartType?: string;
  layoutDirection?: 'vertical' | 'horizontal';
  bgColor?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  fontSize?: number;
  box?: {
    background?: string;
    color?: string;
    fontSize?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DesignService {
  getDefaultDesign(): DesignConfig {
    return {
      chartType: 'bar',
      layoutDirection: 'vertical',
      bgColor: '#ffffff',
      textColor: '#000000',
      textAlign: 'left',
      fontFamily: 'Arial',
      fontSize: 14,
      box: {
        background: '#f0f0f0',
        color: '#000000',
        fontSize: 14
      }
    };
  }
}
