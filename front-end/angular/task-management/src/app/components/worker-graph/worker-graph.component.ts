import { Component, OnInit } from '@angular/core';
import { PresenceHoursService,PresenceStatus, Global } from '../../imports';

@Component({
  selector: 'app-worker-graph',
  templateUrl: './worker-graph.component.html',
  styleUrls: ['./worker-graph.component.css']
})
export class WorkerGraphComponent implements OnInit {
  
  //----------------PROPERTIRS-------------------

  projectsHours: { label: string, y: number }[];
  presenceHours: { label: string, y: number }[];

  //----------------CONSTRUCTOR------------------

  constructor(private presenceHoursService: PresenceHoursService) {
    this.presenceHoursService.UpdatePresenceSubject.subscribe(
      () => {
        this.getPresenceStatusPerProjects();
      }
    );
  }

  //----------------METHODS-------------------

  async ngOnInit() {
    this.getPresenceStatusPerProjects();
  }

  getPresenceStatusPerProjects() {
    let workerId: number = Global.CURRENT_USER.userId;

    this.presenceHoursService.getPresenceStatusPerProjects(workerId).subscribe(
      (data: PresenceStatus[]) => {
        // init projectHours
        this.projectsHours = data.map(d => {
          return { label: d.projectName, y: d.projectHours };
        });

        // init presenceHours
        this.presenceHours = data.map(d => {
          return { label: d.projectName, y: d.presenceHours };
        });
      },
      err => {
        console.log(err);
      });
  }

}
