import { Component, OnInit } from '@angular/core';
import {
  WorkerHoursService,
  WorkerHours,
  Global
} from '../../imports';

@Component({
  selector: 'app-worker-task-list',
  templateUrl: './worker-task-list.component.html',
  styleUrls: ['./worker-task-list.component.css']
})
export class WorkerTaskListComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  workerHours: WorkerHours[] = [];
  isStartedTaskExist: boolean;

  //----------------CONSTRUCTOR------------------

  constructor(private workerHoursService: WorkerHoursService) {
    this.isStartedTaskExist = false;
  }

  //----------------METHODS------------------

  ngOnInit() {
    this.getAllWorkerHours();
  }

  getAllWorkerHours() {
    let workerId: number = Global.CURRENT_USER.userId;
    this.workerHoursService.getAllWorkerHours(workerId).subscribe(
      (workerHours: WorkerHours[]) => {
        this.workerHours = workerHours;
        this.workerHours = this.workerHours.filter(workerHours => workerHours.numHours > 0);
      },
      err => {
        console.log(err);
      }
    )
  }

  disableButtons(isStarted: boolean) {
    this.isStartedTaskExist = isStarted;
  }

}
