import { Component, OnInit, Input } from '@angular/core';
import * as CanvasJS from '../../../assets/js/canvasjs.min';
import { BaseService } from '../../imports';

@Component({
  selector: 'app-graph-chart',
  templateUrl: './graph-chart.component.html',
  styleUrls: ['./graph-chart.component.css']
})
export class GraphChartComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  titleX: string = 'Projects';

  @Input()
  titleY: string = 'Hours';

  @Input()
  nameY1: string = 'Project Hours';

  @Input()
  nameY2: string = 'Presence Hours';


  @Input()
  projectsHours: { label: string, y: number }[] = [];

  @Input()
  presenceHours: { label: string, y: number }[] = [];

  constructor(private baseService:BaseService) {
    let months =this.baseService.getMonths();
    let monthId:number=new Date().getMonth();
    let currMonth:string = months.find(month=>month.monthId==monthId).monthName;
    this.title=currMonth;
   }

  ngOnInit() {
    this.renderChart();

  }

  renderChart() {
    let chart = new CanvasJS.Chart('chartContainer', {
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: this.title
      },
      subtitles: [{
        text: 'Click Legend to Hide or Unhide Data Series'
      }],
      axisX: {
        title: this.titleX
      },
      axisY: {
        title: this.titleY,
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: 'pointer',
        itemclick: this.toggleDataSeries
      },
      data: [{
        type: 'column',
        name: this.nameY1,
        showInLegend: true,
        yValueFormatString: '#,##0.# Hours',
        dataPoints: this.projectsHours
      },
      {
        type: 'column',
        name: this.nameY2,
        //axisYType: 'secondary',
        showInLegend: true,
        yValueFormatString: '#,##0.# Hours',
        dataPoints: this.presenceHours
      }]
    });
    chart.render();
  }
  toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === 'undefined' || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }

  //  Whenever the data in the parent changes, this method gets triggered. You 
  // can act on the changes here. You will have both the previous value and the 
  // current value here.
  ngOnChanges(changes: any) {
    // if (changes.projectsHours.firstChange)
    //   return;
    this.projectsHours = changes.projectsHours.currentValue;
    this.presenceHours = changes.presenceHours.currentValue;
    this.renderChart();
  }
  
}
