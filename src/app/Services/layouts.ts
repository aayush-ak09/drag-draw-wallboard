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
          "x": 0,
          "y": 0,
          "w": 4,
          "h": 24,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        },
        {
          "x": 4,
          "y": 0,
          "w": 4,
          "h": 24,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        },
        {
          "x": 8,
          "y": 0,
          "w": 4,
          "h": 24,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        },
        {
          "x": 12,
          "y": 0,
          "w": 4,
          "h": 24,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        },
        {
          "x": 16,
          "y": 0,
          "w": 14,
          "h": 8,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        },
        {
          "x": 30,
          "y": 0,
          "w": 18,
          "h": 24,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        },
        {
          "x": 16,
          "y": 8,
          "w": 14,
          "h": 8,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        },
        {
          "x": 16,
          "y": 16,
          "w": 14,
          "h": 8,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        },
        {
          "x": 0,
          "y": 24,
          "w": 16,
          "h": 24,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        },
        {
          "x": 16,
          "y": 24,
          "w": 14,
          "h": 24,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        },
        {
          "x": 30,
          "y": 24,
          "w": 18,
          "h": 24,
          "chartType": "text",
          "config": {},
          "style": {
            "bgColor": "rgb(233, 233, 233)",
            "textColor": "rgb(0, 0, 0)",
            "textAlign": "start",
            "fontFamily": "\"Times New Roman\"",
            "fontSize": "16px"
          }
        }
      ]
    }
  ];
    constructor() { }

  getPredefinedLayouts(): PredefinedLayout[] {
    return this.predefinedLayouts;
  }
}
