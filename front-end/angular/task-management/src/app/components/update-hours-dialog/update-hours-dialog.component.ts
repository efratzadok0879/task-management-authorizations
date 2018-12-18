import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import AsEnumerable from 'linq-es2015';
import {
  PresenceHoursService, ValidatorsService,
  User, DepartmentHours
} from '../../imports';

export interface DialogData {
  worker: User;
  departmentHours: DepartmentHours;
}

@Component({
  selector: 'app-update-hours-dialog',
  templateUrl: './update-hours-dialog.component.html',
  styleUrls: ['./update-hours-dialog.component.css']
})
export class UpdateHoursDialogComponent {

  //----------------PROPERTIES------------------

  numHoursControl: FormControl;
  presenceHours: number;
  
  //----------------CONSTRUCTOR------------------

  constructor(
    private presenceHoursService: PresenceHoursService,
    private validatorsService: ValidatorsService,
    public dialogRef: MatDialogRef<UpdateHoursDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.presenceHours = this.presenceHoursService.getPresenceHoursForWorker(this.data.worker);

    let workerHours: number = this.data.worker.workerHours[0].numHours;
    let departmentHours: number = this.data.departmentHours.numHours;
    let departmentHoursSum: number = AsEnumerable(this.data.departmentHours.department.workers).Sum(worker=>worker.workerHours[0].numHours);
      this.numHoursControl = new FormControl(this.data.worker.workerHours[0].numHours,
        [
          this.validatorsService.requiredValidator('worke hours'),
          this.validatorsService.workerHoursValidator(this.presenceHours),
          this.validatorsService.workerHoursDepartmentValidator(workerHours, departmentHours, departmentHoursSum)
        
        ]);
  }

  //----------------METHODS------------------

  close() {
    this.dialogRef.close();
  }

}



