import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import {
  UserService, WorkerHoursService, ProjectService,
  User, eListKind,
  Global, Project
} from '../../imports';

@Component({
  selector: 'app-tmp-user',
  templateUrl: './tmp-user.component.html',
  styleUrls: ['./tmp-user.component.css']
})
export class TmpUserComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  @Input()
  user: User;

  @Input()
  listKind: eListKind;

  imageUrl: string;

  //allow access type via interpolation
  eListKind: typeof eListKind = eListKind;

  //----------------CONSTRUCTOR------------------

  constructor(
    private router: Router,
    private userService: UserService,
    private workerHoursService: WorkerHoursService,
    private projectService: ProjectService
  ) { }

  //----------------METHODS-------------------

  ngOnInit() {
    this.initImageUrl();
  }

  initImageUrl() {
    this.imageUrl = `${Global.UERS_PROFILES}/`;
    if (this.user.profileImageName)
      this.imageUrl += this.user.profileImageName;
    else
      this.imageUrl += 'guest.jpg';
  }

  edit() {
    this.router.navigate(['taskManagement/main/manager/userManagement/editUser', this.user.userId]);
  }

  delete() {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.confirmedDelete();
      }
    });
  }



  async confirmedDelete() {
    //if this user is team-worker and he has incomlete hours we can't delete him
    if (this.user.teamLeaderId != null) {
      let projects: Project[] = await this.projectService.getProjectsByTeamLeaderId(this.user.teamLeaderId).toPromise();
      let teamProjectIdList: number[] = projects.map(project => project.projectId);
      this.workerHoursService.hasUncomletedHours(this.user.userId, teamProjectIdList)
        .subscribe(
          (hasUncomletedHours: boolean) => {
            if (hasUncomletedHours) {
              let msg = 'Immposible to delete a worker who has incomplete hours';
              swal({
                type: 'error',
                title: 'Oops...',
                text: msg,
              })
            }
            else {
              this.deleteUser();
            }
          },
          err => {
            console.log(err);
          }
        );
    }
    //if  this user is a team-leader and he has workers or projects we can't delete him
    else {
      let hasWorkes: boolean = await this.userService.hasWorkers(this.user.userId).toPromise();
      if (hasWorkes) {
        let msg: string = 'Impossible to delete team-leader who has workers';
        swal({
          type: 'error',
          title: 'Oops...',
          text: msg,
        })
        return;
      }
      else {
        let hasProjects: boolean = await this.projectService.hasProjects(this.user.userId).toPromise();
        if (hasProjects) {
          let msg: string = 'Impossible to delete team-leader who has projects';
          swal({
            type: 'error',
            title: 'Oops...',
            text: msg,
          })
          return;
        }
      }
      this.deleteUser();
    }
  }

  deleteUser() {
    this.userService.deleteUser(this.user).subscribe(
      (deleted: boolean) => {
        if (deleted) {
          console.log(deleted);
          swal(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          this.userService.updateUserListSubject.next();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  definePermissions() {
    this.router.navigate(['taskManagement/main/manager/userManagement/permissions', this.user.userId]);
  }

  teamManagement() {
    this.router.navigate(['taskManagement/main/manager/teamsManagement/teamManagement', this.user.userId]);
  }

  updateHours() {
    this.router.navigate(['taskManagement/main/teamLeader/teamWorkers/workerHoursManagement', this.user.userId]);
  }
  
}
