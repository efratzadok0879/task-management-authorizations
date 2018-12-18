import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, ProjectService, User, Project } from '../../imports';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./../../../form-style.css','./permissions.component.css']
})
export class PermissionsComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  userId: number;
  user: User;
  teamProjects: Project[];

  //----------------CONSTRUCTOR------------------

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private projectService: ProjectService,
  ) { }

  //----------------METHODS-------------------

  ngOnInit() {
    this.activatedRoute.params.subscribe(param => this.userId = param['id']);
    this.initUser();
  }

  initUser() {
    this.userService.getUserById(this.userId).subscribe(
      (user: User) => {
        this.user = user;
        this.initProjectList();
      },
      err => {
        console.log(err);
      }
    );
  }

  initProjectList() {
    this.projectService.getAllProjects().subscribe(
      (projects: Project[]) => {
        let teamLeaderId: number = this.user.teamLeaderId == null ? this.user.userId : this.user.teamLeaderId;
        this.teamProjects = projects.filter(project => project.teamLeaderId == teamLeaderId);
      },
      err => {
        console.log(err);
      }
    );
  }
  
}
