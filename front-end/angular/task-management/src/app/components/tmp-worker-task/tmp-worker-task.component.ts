import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  PresenceHoursService,
  WorkerHours, PresenceHours,
  Global
} from '../../imports';
import swal from 'sweetalert2';

@Component({
  selector: 'app-tmp-worker-task',
  templateUrl: './tmp-worker-task.component.html',
  styleUrls: ['./tmp-worker-task.component.css']
})
export class TmpWorkerTaskComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  @Input()
  workerHour: WorkerHours;

  @Input()
  disabled: boolean;

  @Output()
  isStartedEvent: EventEmitter<boolean>;


  isStarted: boolean;
  btnMessage: string;
  btnIcon: string;
  presenceHours: PresenceHours;

  presenceSum: number;
  presence: Date;
  stopHandle;
  complete: boolean;

  //----------------CONSTRUCTOR------------------

  constructor(private presenceHoursService: PresenceHoursService) {
    this.isStarted = false;
    this.btnMessage = 'start your task';
    this.isStartedEvent = new EventEmitter<boolean>();
    this.btnIcon = 'fa fa-play';
    this.complete = false;
  }

  //----------------METHODS-------------------

  ngOnInit() {
    this.updatePresenceSum();
  }

  btnTaskClick() {
    if (this.isStarted == false) {
      this.startTask();
    }
    else {
      this.stopTask();
    }
    this.isStartedEvent.emit(this.isStarted);
  }

  addPresenceHours() {
    let userId: number = Global.CURRENT_USER.userId
    let startDate = new Date();
    this.presenceHours = new PresenceHours(0, userId, this.workerHour.projectId, startDate, null);
    this.presenceHoursService.addPresenceHours(this.presenceHours).subscribe(
      (presenceHoursId) => {
        this.presenceHours.presenceHoursId = presenceHoursId;
      },
      err => {
        console.log(err);
      }
    );
  }

  editPresenceHours() {
    this.presenceHours.endHour = new Date();
    this.presenceHoursService.editPresenceHours(this.presenceHours).subscribe(
      () => {
        this.updatePresenceSum();
      },
      err => {
        console.log(err);
      }
    );
  }

  async startTask() {
    this.isStarted = true;
    this.btnMessage = 'stop your task';
    this.btnIcon = 'fa fa-pause';
    this.addPresenceHours();
    //check when to stop automatically
    let timeOut: number = (this.workerHour.numHours - this.presenceSum) * 60 * 60 * 1000
    this.stopHandle = setTimeout(() => {
      this.btnTaskClick();
      this.complete = true;
      let msg: string = 'You can turn to another task.if you need more time to this task pleas contact your team-leader';
      swal({
        type: 'info',
        title: 'Your task is complete',
        text: msg,
      })
    }, timeOut);
  }

  stopTask() {
    this.isStarted = false;
    this.btnMessage = 'start your task';
    this.btnIcon = 'fa fa-play';
    this.editPresenceHours();
    clearTimeout(this.stopHandle);
    this.presenceHoursService.UpdatePresenceSubject.next();
  }

  updatePresenceSum() {
    this.presenceHoursService.getPresenceHoursSum(this.workerHour.projectId, this.workerHour.workerId).subscribe(
      (presenceSum: number) => {
        this.presenceSum = presenceSum;
        this.presence = new Date();
        this.presence.setHours(0, 0, this.presenceSum * 60 * 60, 0);
      },
      err => {
        console.log(err);
      }
    );
  }

}
