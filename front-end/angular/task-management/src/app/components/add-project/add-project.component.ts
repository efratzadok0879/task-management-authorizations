import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import { asEnumerable } from 'linq-es2015';
import swal from 'sweetalert2';
import {
  ProjectService, CustomerService, UserService, DepartmentService, ValidatorsService,
  Project, Customer, User, Department, DepartmentHours, Permission,
  Global,
} from '../../imports';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./../../../form-style.css', './add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  projectFormGroup: FormGroup;
  project: Project;

  customers: Customer[];
  teamLeaders: User[];
  departments: Department[];
  extraWorkers: User[];
  selectedWorkers: User[];

  //allow access 'Object' type via interpolation
  objectHolder: typeof Object = Object;

  @ViewChild('formDirective')
  formDirective: FormGroupDirective;


  //----------------CONSTRUCTOR------------------

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private customerService: CustomerService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private validatorsService: ValidatorsService
  ) { }

  //----------------METHODS-------------------

  async ngOnInit() {
    this.getAllCustomers();
    this.getAllTeamLeaders();
    this.departments = await this.departmentService.getAllDepartments();
    this.initFormGroup();
  }

  initFormGroup() {
    this.projectFormGroup = this.formBuilder.group({
      projectName: ['', this.validatorsService.stringValidatorArr('project name', 2, 15, /^[A-Za-z0-9]+$/), this.validatorsService.uniqueProjectValidator('projectName')],
      customerId: ['', this.validatorsService.stringValidatorArr('customer')],
      teamLeaderId: ['', this.validatorsService.stringValidatorArr('team leader')],
      totalHours: this.getDepartmentControls(),
      startDate: [''],
      endDate: [''],
    });
    this.startDate.setValidators(this.validatorsService.dateValidatorArr('start date', this.projectFormGroup));
    this.endDate.setValidators(this.validatorsService.dateValidatorArr('end date', this.projectFormGroup));
  }

  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe(
      (customers: Customer[]) => {
        this.customers = customers;
      },
      err => {
        console.log(err);
      }
    );
  }

  getAllTeamLeaders() {
    this.userService.getAllTeamLeaders().subscribe(
      (teamLeaders: User[]) => {
        this.teamLeaders = teamLeaders;
      },
      err => {
        console.log(err);
      }
    );
  }

  getAllDepartments() {
    this.departmentService.getAllDepartments().then(
      (departments: Department[]) => {
        this.departments = departments;
        this.initFormGroup();
      },
      err => {
        console.log(err);
      }
    );
  }

  getDepartmentControls(): FormGroup {
    let formGroup: FormGroup = new FormGroup({}, this.validatorsService.sumValidator('total hours', 1));
    this.departments.forEach(department => {
      let formControl: FormControl = new FormControl(null, this.validatorsService.numberValidatorArr(department.departmentName, 0));
      formControl.updateValueAndValidity();
      formGroup.addControl(department.departmentName, formControl);
    });
    return formGroup;
  }

  getTotalHours() {
    return asEnumerable(Object.values((this.totalHours).controls)).Sum(x => Number((<FormControl>x).value));
  }

  onTeamLeaderChange() {
    this.getExtraWorkers();
    this.userService.resetPermissionSubject.next();
  }

  getExtraWorkers() {
    this.userService.getAllUsers().subscribe(
      (workers: User[]) => {
        this.extraWorkers = workers.filter(worker => worker.teamLeaderId != null && worker.teamLeaderId != this.teamLeaderId.value);
      },
      err => {
        console.log(err);
      }
    );
  }

  getSelectedWorkers(workers: User[]) {
    this.selectedWorkers = workers;
  }

  onSubmit() {
    this.project = this.projectFormGroup.value;
    this.project.managerId = Global.CURRENT_USER.userId;
    this.project.totalHours = this.getTotalHours();
    this.project.startDate.setHours(this.project.startDate.getHours() - this.project.startDate.getTimezoneOffset() / 60);
    this.project.endDate.setHours(this.project.endDate.getHours() - this.project.endDate.getTimezoneOffset() / 60);

    //init departmentsHours array
    this.project.departmentsHours = [];
    let i: number = 0;
    Object.values(this.totalHours.controls).forEach(departmentHour => {
      let departmentHours: DepartmentHours = new DepartmentHours(0, 0, this.departments[i].departmentId, departmentHour.value);
      this.project.departmentsHours.push(departmentHours);
      i++;
    });
    //init permissions array if exsits
    if (this.selectedWorkers) {
      this.project.permissions = [];
      this.selectedWorkers.forEach(worker => {
        let permission: Permission = new Permission(0, worker.userId, 0, true);
        this.project.permissions.push(permission);
      })
    }
    this.addProject();
  }

  addProject() {
    this.projectService.addProject(this.project).subscribe(
      (created: boolean) => {
        if (created) {
          swal({
            type: 'success',
            title: `${this.project.projectName} added succsesully`,
          });
          this.formDirective.resetForm();
          this.project=null;
        }
        else {
          swal({
            type: 'error',
            title: 'Oops...',
            text: `Sorry,${this.project.projectName} failed`,
          });
        }
      },
      err =>
        console.log(err)
    );
  }


  //----------------GETTERS-------------------

  //getters of the form group controls

  get projectName() {
    return this.projectFormGroup.controls['projectName'];
  }

  get customerId() {
    return this.projectFormGroup.controls['customerId'];
  }

  get teamLeaderId() {
    return this.projectFormGroup.controls['teamLeaderId'];
  }

  get totalHours(): FormGroup {
    return <FormGroup>(this.projectFormGroup.controls['totalHours']);
  }

  get startDate() {
    return this.projectFormGroup.controls['startDate'];
  }

  get endDate() {
    return this.projectFormGroup.controls['endDate'];
  }

}
