import { Component, Input } from '@angular/core';
import { PermissionService, User, Permission } from '../../imports';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css']
})
export class PermissionListComponent {

  //----------------PROPERTIRS-------------------

  @Input()
  user: User;

  //----------------CONSTRUCTOR------------------

  constructor(private permissionService: PermissionService) {
    this.permissionService.deletePermissionSubject.subscribe(
      (permission: Permission) => {
        this.user.permissions.splice(this.user.permissions.indexOf(permission), 1);
      }
    );
    this.permissionService.addPermissionSubject.subscribe(
      (permission: Permission) => {
        this.user.permissions.push(permission);
      }
    );
  }
  
}
