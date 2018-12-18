import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsEnumerable } from 'linq-es2015';
import { MatDialog } from '@angular/material';
import {
  ProjectService, PresenceHoursService, WorkerHoursService,
  Project, User, DepartmentHours,
  UpdateHoursDialogComponent
} from '../../imports';

@Component({
  selector: 'app-workers-hours',
  templateUrl: './workers-hours.component.html',
  styleUrls: ['./workers-hours.component.css']
})
export class WorkersHoursComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  project: Project;
  workersHours: number;
  presence: number;
  //----------------CONSTRUCTOR------------------

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private presenceHoursService: PresenceHoursService,
    private workerHoursService: WorkerHoursService,
    private dialog: MatDialog) {
  }

  //----------------METHODS-------------------

  ngOnInit() {
    let projectId: number;
    this.activatedRoute.params.subscribe(param => projectId = param['projectId']);
    this.projectService.getProjectById(projectId).subscribe(
      (project: Project) => {
        this.projectService.initDates([project]);
        this.project = project;
        this.workersHours = AsEnumerable(this.project.departmentsHours).Sum(departmentHours => AsEnumerable(departmentHours.department.workers).Sum(worker => worker.workerHours[0].numHours));
        this.presence = this.presenceHoursService.getPresenceHoursForProject(this.project);
      },
      err => {
        console.log(err);
      }
    );
  }

  getPresenceHours(worker: User) {
    return this.presenceHoursService.getPresenceHoursForWorker(worker);
  }

  updateHours(worker: User, departmentHours: DepartmentHours) {
    const dialogRef = this.dialog.open(UpdateHoursDialogComponent, {
      width: '40%',
      data: {
        worker, departmentHours
      }
    });
    dialogRef.afterClosed().subscribe((numHours: number) => {
      if (numHours) {
        worker.workerHours[0].numHours = +numHours;
        this.workerHoursService.editWorkerHours(worker.workerHours[0]).subscribe(
          () => {
          },
          err => {
            console.log(err);
          }
        );
      }
    });
  }
}
