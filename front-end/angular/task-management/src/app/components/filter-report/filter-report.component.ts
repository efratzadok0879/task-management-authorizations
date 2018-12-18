import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  UserService, ProjectService, BaseService,
  User, Project
} from '../../imports';

@Component({
  selector: 'app-filter-report',
  templateUrl: './filter-report.component.html',
  styleUrls: ['./filter-report.component.css']
})
export class FilterReportComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  filterFormGroup: FormGroup;

  months: { monthId: number, monthName: string }[];
  workers: User[];
  teamLeaders: User[];
  projects: Project[];

  //----------------CONSTRUCTOR------------------

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private baseService: BaseService,
    private formBuilder: FormBuilder
  ) { }

  //----------------METHODS-------------------

  ngOnInit() {
    this.initFormGroup();
    //listening to changes
    this.filterFormGroup.valueChanges.subscribe(() => {
      this.projectService.filterSubject.next(this.filterFormGroup.value);
    });

    this.months = this.baseService.getMonths();
    this.initWorkersAndTeamLeaders();
    this.initProjects();
  }

  initFormGroup() {
    this.filterFormGroup = this.formBuilder.group({
      monthId: [null],
      workerId: [null],
      teamLeaderId: [null],
      projectId: [null]
    });
  }

  initWorkersAndTeamLeaders() {
    this.userService.getAllUsers().subscribe(
      (workers: User[]) => {
        this.workers = workers.filter(worker => worker.teamLeaderId != null);
        this.teamLeaders = workers.filter(worker => worker.teamLeaderId == null);
      },
      err => {
        console.log(err);
      }
    );
  }

  initProjects() {
    this.projectService.getAllProjects().subscribe(
      (projects: Project[]) => {
        this.projects = projects;
      },
      err => {
        console.log(err);
      }
    );
  }

  //----------------GETTERS-------------------

  //getters of the form group controls

  get monthId() {
    return this.filterFormGroup.controls['monthId'];
  }

  get workerId() {
    return this.filterFormGroup.controls['workerId'];
  }

  get teamLeaderId() {
    return this.filterFormGroup.controls['teamLeaderId'];
  }

  get projectId() {
    return this.filterFormGroup.controls['projectId'];
  }
}
