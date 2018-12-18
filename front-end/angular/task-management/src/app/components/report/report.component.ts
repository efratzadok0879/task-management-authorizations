import { Component, OnInit ,ViewChild,ElementRef} from '@angular/core';
import {
  ProjectService, ExcelService,
  Project, ProjectFilter, Global
} from '../../imports';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  projectsReport: Project[];
  conditions: ProjectFilter;
  state: string;

  @ViewChild('projectReportList')
  projectReportList:any;

  //----------------CONSTRUCTOR------------------

  constructor(
    private projectService: ProjectService,
    private excelService: ExcelService) {
    this.projectService.filterSubject.subscribe(
      (conditions: ProjectFilter) => {
        this.conditions = conditions;
      }
    );
  }

  //----------------METHODS-------------------

  ngOnInit() {
    this.initProjectsReport();
  }

  initProjectsReport() {
    this.projectService.getProjectsReports().subscribe(
      (projects: Project[]) => {
        projects.forEach(project=>
          project.departmentsHours.forEach(departmentHours=>
            departmentHours.department.workers=departmentHours.department.workers.filter(worker=>worker.workerHours[0].numHours>0)
          )
        );
        this.projectService.initDates(projects)
        this.projectsReport = projects;

      },
      err => {
        console.log(err);
      }
    );
  }

  exportToExcel() {
    let userName: string = Global.CURRENT_USER.userName;
    let excelData=[];
    let projectsInfo=this.projectReportList.projectsInfo;
    projectsInfo.forEach(project=>{
      excelData.push(project.data);
      project.children.forEach(department=>{
        department.data.name=`    ${department.data.name}`;
        excelData.push(department.data);
        
        department.children.forEach(worker=>{
          worker.data.name=`        ${worker.data.name}`;
          excelData.push(worker.data);
        });
      });
    });
    this.excelService.exportAsExcelFile(excelData, `${userName}_projects`);
  }

  openRequestForm() {
    this.state = "in";
  }
  closeRequestForm() {
    this.state = "out"
  }
}