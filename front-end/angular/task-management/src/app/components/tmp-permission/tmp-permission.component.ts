import { Component, Input } from '@angular/core';
import swal from 'sweetalert2';
import {
  PermissionService, WorkerHoursService,
  Permission,
} from '../../imports';

@Component({
  selector: 'app-tmp-permission',
  templateUrl: './tmp-permission.component.html',
  styleUrls: ['./tmp-permission.component.css']
})
export class TmpPermissionComponent {

  //----------------PROPERTIRS-------------------

  @Input()
  permission: Permission;

  //----------------CONSTRUCTOR------------------

  constructor(
    private permissionService: PermissionService,
    private workerHoursService: WorkerHoursService
  ) { }

  //----------------METHODS-------------------

  async deletePermission() {
    let hasUncomletedHours: boolean = await this.workerHoursService.hasUncomletedHours(this.permission.workerId, [this.permission.projectId]).toPromise();
    if (hasUncomletedHours)
     {
     let msg:string= 'It is not possible to remove a worker\'s permission to a project if hours were defined for him to this project';
      swal({
        type: 'error',
        title: 'Oops...',
        text: msg,
      }) 
     } 
    else
      this.permissionService.deletePermission(this.permission.permissionId).subscribe(
        (deleted: boolean) => {
          if (deleted)
            this.permissionService.deletePermissionSubject.next(this.permission);
        },
        err => {
          console.log(err);
        }
      );
  }

}
