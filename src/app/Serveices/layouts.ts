import { Injectable } from '@angular/core';

export interface PredefinedLayout {
  name: string;
  description: string;
  widgets: any[];
}

@Injectable({
  providedIn: 'root'
})
export class Layouts {

  private predefinedLayouts: PredefinedLayout[] = [
    {
      name: 'Single Large Stat',
      description: 'A single, large stat block for a key metric.',
      widgets: [
        {
          x: 0,
          y: 0,
          w: 6,
          h: 4,
          chartType: 'text',
          style: {
            bgColor: '#f0f4f8',
            textColor: '#000000',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            fontSize: '1.5em'
          },
          config: {
            stats: [['Revenue', '$1.2M']],
            layoutDirection: 'row'
          }
        }
      ]
    },
    {
      name: 'Two Column Stats',
      description: 'Two columns of stats for comparison.',
      widgets: [
        {
          x: 0,
          y: 0,
          w: 3,
          h: 4,
          chartType: 'text',
          style: {
            bgColor: '#e8f0fe',
            textColor: '#000000',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            fontSize: '1.2em'
          },
          config: {
            stats: [
              ['Users', '5,432'],
              ['New Signups', '120']
            ],
            layoutDirection: 'column'
          }
        },
        {
          x: 3,
          y: 0,
          w: 3,
          h: 4,
          chartType: 'text',
          style: {
            bgColor: '#f4e8fe',
            textColor: '#000000',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            fontSize: '1.2em'
          },
          config: {
            stats: [
              ['Bounce Rate', '45%'],
              ['Conversion', '3.2%']
            ],
            layoutDirection: 'column'
          }
        }
      ]
    },
    // Add more predefined layouts as needed
  ];

  constructor() { }

  getPredefinedLayouts(): PredefinedLayout[] {
    return this.predefinedLayouts;
  }
}