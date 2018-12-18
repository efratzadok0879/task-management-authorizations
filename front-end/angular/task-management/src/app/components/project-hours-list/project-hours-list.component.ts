import { Component, OnInit } from '@angular/core';
import { ProjectService, Project,Global } from '../../imports';

@Component({
  selector: 'app-project-hours-list',
  templateUrl: './project-hours-list.component.html',
  styleUrls: ['./project-hours-list.component.css']
})
export class ProjectHoursListComponent implements OnInit {

  //----------------PROPERTIRS-------------------
  
  projects: Project[];

  //----------------CONSTRUCTOR------------------

  constructor(private projectService: ProjectService) {
    this.projects = [];
  }

  //----------------METHODS-------------------

  ngOnInit() {
    let teamLeaderId: number = Global.CURRENT_USER.userId;
    this.projectService.getProjectsByTeamLeaderId(teamLeaderId).subscribe(
      (projects: Project[]) => {
        this.projectService.initDates(projects)
        this.projects = projects;
      },
      err => {
        console.log(err);
      }
    );
  }

}
