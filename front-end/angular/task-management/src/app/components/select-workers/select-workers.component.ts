import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import {
  UserService, ProjectService, WorkerHoursService, ValidatorsService,
  User, Project
} from '../../imports';

@Component({
  selector: 'app-select-workers',
  templateUrl: './select-workers.component.html',
  styleUrls: ['./../../../form-style.css', './select-workers.component.css']
})
export class SelectWorkersComponent {

  //----------------PROPERTIRS-------------------

  @Input()
  workers: User[];

  @Input()
  title: string;

  @Input()
  isTeamManagement: boolean = false;

  selectedWorkers: User[] = [];

  selectedWorkerControl: FormControl;

  @Output()
  selectedWorkerEvent: EventEmitter<User[]>;

  //----------------CONSTRUCTOR------------------

  constructor(private userService: UserService, private validatorsService: ValidatorsService, private projectService: ProjectService, private workerHoursService: WorkerHoursService) {

    this.selectedWorkerControl = new FormControl('');

    this.selectedWorkerEvent = new EventEmitter<User[]>();

    this.userService.resetPermissionSubject.subscribe(
      () => {
        this.selectedWorkers = [];
      }
    );
  }

  //----------------METHODS-------------------

  async addWorker() {
    if (this.isTeamManagement == false || await this.checkWorkerToTeamValidator()) {
      let worker: User = this.workers.find(worker => worker.userId == this.selectedWorkerControl.value);
      this.selectedWorkers.push(worker);
      this.workers.splice(this.workers.indexOf(worker), 1);
      if (this.isTeamManagement == false) {
        this.selectedWorkerEvent.emit(this.selectedWorkers);
      }
    }
  }

  removeWorker(worker: User) {
    this.workers.push(worker);
    this.selectedWorkerControl.setValue(null);
    this.selectedWorkers.splice(this.selectedWorkers.indexOf(worker), 1);
    if (this.isTeamManagement == false)
      this.selectedWorkerEvent.emit(this.selectedWorkers);
  }

  async checkWorkerToTeamValidator() {
    let workerId: number = this.selectedWorkerControl.value;
    let teamLeaderOfWorker = this.workers.find(worker => worker.userId == workerId).teamLeaderId;
    let projects: Project[] = await this.projectService.getProjectsByTeamLeaderId(teamLeaderOfWorker).toPromise();
    let teamProjectIdList: number[] = projects.map(project => project.projectId);
    let hasUncomletedHours: boolean = await this.workerHoursService.hasUncomletedHours(workerId, teamProjectIdList).toPromise();
    if (hasUncomletedHours) {
      swal({
        type: 'error',
        title: 'Impossible to change the worker\'s team-leader if he has defined hours',
      }).then(() => {
        this.selectedWorkerControl.setValue('');
      });
      return false
    }
    return true
  }

  submit() {
    this.selectedWorkerEvent.emit(this.selectedWorkers);
  }
  
}
