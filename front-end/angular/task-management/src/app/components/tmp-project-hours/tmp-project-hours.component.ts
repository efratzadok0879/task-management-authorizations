import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../imports';

@Component({
  selector: 'app-tmp-project-hours',
  templateUrl: './tmp-project-hours.component.html',
  styleUrls: ['./tmp-project-hours.component.css']
})
export class TmpProjectHoursComponent {

  //----------------PROPERTIRS-------------------

  @Input()
  project: Project;

  //----------------CONSTRUCTOR------------------

  constructor(private router: Router) {
  }

  //----------------METHODS-------------------

  updateWorkersHours() {
    this.router.navigate(['taskManagement/main/teamLeader/workerHoursManagement/workersHours',this.project.projectId]);
  }

}
