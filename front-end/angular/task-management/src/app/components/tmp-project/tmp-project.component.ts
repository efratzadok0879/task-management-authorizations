import { Component, OnInit, Input } from '@angular/core';
import { PresenceHoursService, Project } from '../../imports';

@Component({
  selector: 'app-tmp-project',
  templateUrl: './tmp-project.component.html',
  styleUrls: ['./tmp-project.component.css']
})
export class TmpProjectComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  @Input()
  project: Project;

  projectPresenseHours: number;
  projectPercentHours: number;

  //----------------CONSTRUCTOR------------------

  constructor(private presenceHoursService: PresenceHoursService) { }

  //----------------METHODS-------------------

  ngOnInit() {
    this.projectPresenseHours = this.presenceHoursService.getPercentHoursForProject(this.project);
    this.projectPercentHours = this.presenceHoursService.getPercentHoursForProject(this.project);
  }

}
