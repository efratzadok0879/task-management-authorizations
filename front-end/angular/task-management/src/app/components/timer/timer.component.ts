import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {

  //----------------PROPERTIRS-------------------

  @Input()
  isStarted: boolean;

  timer: Date;
  seconds: number = 0;
  startHandle:any;
  
  //----------------CONSTRUCTOR------------------

  constructor() {
    this.timer = new Date();
    this.timer.setHours(0, 0, 0, 0);
  }

  //----------------METHODS-------------------

  //  Whenever the data in the parent changes, this method gets triggered. You 
  // can act on the changes here. You will have both the previous value and the 
  // current value here.
  ngOnChanges(changes: any) {
    if (changes.isStarted.firstChange)
      return;
    if (changes.isStarted.currentValue == true) {
      this.startTimer();
    }
    else {
      clearInterval(this.startHandle);
      this.seconds=0;
    }

  }

  startTimer() {
    this.startHandle=setInterval(() => {
      this.timer = new Date();
      this.timer.setHours(0, 0, 0, 0);
      this.timer.setSeconds(this.seconds);
      this.seconds++;
    }, 1000);
  }

}
