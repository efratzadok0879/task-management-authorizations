import { Component, OnInit } from '@angular/core';
import { ProjectService, Project, Global } from '../../imports';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  teamProjects: Project[];

  //----------------CONSTRUCTOR------------------

  constructor(private projectService: ProjectService) { }

  //----------------METHODS-------------------

  ngOnInit() {
    this.initProjectList();
  }

  initProjectList() {
    let teamLeaderId: number = Global.CURRENT_USER.userId;
    this.projectService.getProjectsByTeamLeaderId(teamLeaderId).subscribe(
      (projects: Project[]) => {
        this.projectService.initDates(projects);
        this.teamProjects = projects;
      },
      err => {
        console.log(err);
      }
    );
  }
}
