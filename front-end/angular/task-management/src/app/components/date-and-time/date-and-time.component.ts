import { Component } from '@angular/core';

@Component({
  selector: 'app-date-and-time',
  templateUrl: './date-and-time.component.html',
  styleUrls: ['./date-and-time.component.css']
})
export class DateAndTimeComponent {

  //----------------PROPERTIRS-------------------

  currDateTime: Date;

  //----------------CONSTRUCTOR------------------

  constructor() {
    this.utcTime();
  }

  //----------------METHODS-------------------

  utcTime(): void {
    setInterval(() => {
      this.currDateTime = new Date();
    }, 1000);
  }

}
