import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { PresenceHoursService, BaseService, ExcelService, Project, Global, } from '../../imports';

@Component({
  selector: 'app-project-report-list',
  templateUrl: './project-report-list.component.html',
  styleUrls: ['./project-report-list.component.css']
})
export class ProjectReportListComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  @Input()
  projects: Project[];

  projectsInfo: TreeNode[];
  colomns: { field: string, header: string }[];

  //----------------CONSTRUCTOR-------------------

  constructor(
    private presenceHoursService: PresenceHoursService,
    private baseService: BaseService) {
    this.colomns = [
      { field: 'name', header: 'Name' },
      { field: 'teamLeader', header: 'TeamLeader' },
      { field: 'hours', header: 'Hours' },
      { field: 'presence', header: 'Presence' },
      { field: 'presencePercent', header: 'Presence Percent' },
      { field: 'customer', header: 'Customer' },
      { field: 'startDate', header: 'Start' },
      { field: 'endDate', header: 'End' },
      { field: 'days', header: 'Days' },
      { field: 'workedDays', header: 'Worked' },
      { field: 'daysPercent', header: 'Days Percent' },
      { field: 'status', header: 'Status' }
    ];
  }

  //----------------METHODS-------------------

  ngOnInit() {
    this.initProjectsInfo();
  }

  //  Whenever the data in the parent changes, this method gets triggered. You 
  // can act on the changes here. You will have both the previous value and the 
  // current value here.
  ngOnChanges(changes: any) {
    if (changes.projects.firstChange)
      return;
    this.projects = changes.projects.currentValue;
    this.initProjectsInfo();
  }

  initProjectsInfo() {
    this.projectsInfo = this.projects.map(project => this.getProjectInfo(project));
  }

  getProjectInfo(project: Project): TreeNode {
    let projectDays: number = this.baseService.dateDiffInDays(project.startDate, project.endDate);
    let date = new Date();
    if (date > project.endDate)
      date = project.endDate;
    let workedDays: number = this.baseService.dateDiffInDays(project.startDate, date);
    let daysPercent: number = workedDays / projectDays;

    let projectPresenseHours: number = this.presenceHoursService.getPresenceHoursForProject(project);
    let projectPercentHours: number = this.presenceHoursService.getPercentHoursForProject(project);
    let status: string = project.isComplete ? "Finished!" : project.endDate <= new Date() ? "Time Over!" : "In Working!";

    let root = {
      //project details
      data: {
        name: project.projectName,
        teamLeader: project.teamLeader.userName,
        hours: project.totalHours,
        presence: this.baseService.toShortNumber(projectPresenseHours),
        presencePercent: this.baseService.toPercent(projectPercentHours),
        customer: project.customer.customerName,
        startDate: project.startDate.toLocaleDateString(),
        endDate: project.endDate.toLocaleDateString(),
        days: projectDays,
        workedDays: workedDays,
        daysPercent: this.baseService.toPercent(daysPercent),
        status: status
      },
      children: []
    };
    //department details
    project.departmentsHours.forEach(departmentHours => {
      let presenceHoursForDepartment = this.presenceHoursService.getPresenceHoursForDepartment(departmentHours.department)
      let departmentNode = {
        data: {
          name: departmentHours.department.departmentName,
          hours: departmentHours.numHours,
          presence: this.baseService.toShortNumber(presenceHoursForDepartment),
          presencePercent: departmentHours.numHours > 0 ? this.baseService.toPercent(presenceHoursForDepartment / departmentHours.numHours) : '-'
        },
        children: [

        ]
      };
      //workers details
      departmentHours.department.workers.forEach(worker => {
        let presenceHoursForWorker = this.presenceHoursService.getPresenceHoursForWorker(worker)
        let workerNode = {
          data: {
            name: worker.userName,
            teamLeader: worker.teamLeader.userName,
            hours: worker.workerHours[0].numHours,
            presence: this.baseService.toShortNumber(presenceHoursForWorker),
            presencePercent: worker.workerHours[0].numHours > 0 ? this.baseService.toPercent(presenceHoursForWorker / worker.workerHours[0].numHours) : '-'
          }
        };
        departmentNode.children.push(workerNode);
      })

      root.children.push(departmentNode);
    });
    return <TreeNode>(root);
  }

}
