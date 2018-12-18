import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { UserService, User, Global } from '../../imports';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./../../../form-style.css', './team-management.component.css']
})
export class TeamManagementComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  teamLeaderId: number;
  teamLeader: User;
  teamWorkers: User[] = [];
  extraWorkers: User[];

  //allow access type 'Global' via interpolation
  global: any = Global;

  //----------------CONSTRUCTOR------------------

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) { }

  //----------------METHODS-------------------

  ngOnInit() {
    this.activatedRoute.params.subscribe(param => this.teamLeaderId = param['teamLeaderId']);
    this.initTeamWorkers();
    this.getTeamLeader();
  }

  initTeamWorkers() {
    this.userService.getAllUsers().subscribe(
      (workers: User[]) => {
        this.teamWorkers = workers.filter(worker => worker.teamLeaderId == this.teamLeaderId);
        this.extraWorkers = workers.filter(worker => worker.teamLeaderId != null && worker.teamLeaderId != this.teamLeaderId);
      },
      err => {
        console.log(err);
      }
    );
  }

  getTeamLeader() {
    this.userService.getUserById(this.teamLeaderId).subscribe(
      (teamLeader: User) => {
        this.teamLeader = teamLeader;
      },
      err => {
        console.log(err);
      }
    );
  }

  submit(selectedWorkers: User[]) {
    this.belongWorkersToTeamLeader(selectedWorkers);
  }

  belongWorkersToTeamLeader(selectedWorkers: User[]) {
    let allEdited: boolean = true;
    selectedWorkers.forEach(selectedWorker => {

      selectedWorker.teamLeaderId = this.teamLeaderId;
      selectedWorker.teamLeader=null;
      selectedWorker.permissions = null;

      this.userService.editUser(selectedWorker).subscribe(
        (edited: boolean) => {
          if (edited == false)
            allEdited = false;
        },
        err => {
          console.log(err);
        })
    });
    if (allEdited == true) {
      swal({
        type: 'success',
        text: `saved succesfully`,
      }).then(()=>{
        this.router.navigate(['taskManagement/main/manager/teamsManagement'])
      });
    }
  }

}
