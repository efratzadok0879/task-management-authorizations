import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  UserService, DepartmentService, ProjectService, ValidatorsService,
  User, Department, Project,
  Global
} from '../../imports';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./../../../form-style.css']
})
export class UserFormComponent implements OnInit {

  //----------------PROPERTIRS-------------------

  userFormGroup: FormGroup;

  //allow access from html page to 'Object' type
  objectHolder: typeof Object = Object;

  imageFile: any;
  imageUrl: string;

  departments: Department[];
  teamLeaders: User[];
  teamProjectIdList: number[];

  @Input()
  caption: string;

  @Input()
  user: User;

  @Output()
  dataEvent: EventEmitter<{ user: User, imageFile: string }>;


  //----------------CONSTRUCTOR------------------

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private departmentService: DepartmentService,
    private projectService: ProjectService,
    private validatorsService: ValidatorsService
  ) {
    this.imageUrl = null;

    this.dataEvent = new EventEmitter<{ user: User, imageFile: string }>();
  }

  //----------------METHODS-------------------

  ngOnInit() {
    if (this.user.profileImageName != null)
      this.imageUrl = `${Global.UERS_PROFILES}/${this.user.profileImageName}`;
    this.getAllDepartments();
    this.getAllTeamLeaders();
  }

  async initFormGroup() {
    this.userFormGroup = this.formBuilder.group({
      userName: [this.user.userName, this.validatorsService.stringValidatorArr('user name', 2, 15, /^[A-Za-z0-9]+$/)],
      email: [this.user.email, this.validatorsService.stringValidatorArr('email', 15, 30, /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/), [this.validatorsService.uniqueUserValidator(this.user, 'email')]],
      password: [this.user.password, this.validatorsService.stringValidatorArr('password', 5, 10), [this.validatorsService.uniqueUserValidator(this.user, 'password')]],
      confirmPassword: [this.user.confirmPassword, this.validatorsService.stringValidatorArr('confirm password', 5, 10)],
      departmentId: [this.user.departmentId],
      teamLeaderId: [this.user.teamLeaderId],
      isTeamLeader: [this.user.teamLeaderId == null],
    });

    if (this.user.userId > 0) {
      this.userFormGroup.removeControl("password");
      this.userFormGroup.removeControl("confirmPassword");
      //team-leader-validation
      if (this.user.teamLeaderId != null) {
        {
          let projects: Project[] = await this.projectService.getProjectsByTeamLeaderId(this.user.teamLeaderId).toPromise();
          this.teamProjectIdList = projects.map(project => project.projectId);
        }
        this.setTeamLeaderAndDepartmentValidators();
        this.isTeamLeader.setAsyncValidators(this.validatorsService.workerToTeamLeaderValidator(this.user.userId, this.teamProjectIdList));
      }
    }
    else {
      this.confirmPassword.setValidators(this.validatorsService.confirmPasswordValidator(this.userFormGroup));
      this.password.setValidators(this.validatorsService.confirmPasswordValidator(this.userFormGroup));
     
    }
    this.isTeamLeader.valueChanges.subscribe(
      () => {
        this.teamLeader();
      });
  }

  getAllDepartments() {
    this.departmentService.getAllDepartments().then(
      (departments: Department[]) => {
        this.departments = departments;
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
        if (this.user.userId > 0 && this.user.teamLeaderId == null) {
          let index: number = teamLeaders.findIndex(teamLeader => teamLeader.userId == this.user.userId);
          this.teamLeaders.splice(index, 1);
        }
        this.initFormGroup();

      },
      err => {
        console.log(err);
      }
    );
  }

  teamLeader() {
    Promise.resolve(null).then(() => {
      //if the worker is team-leader:
      // the manager doesn't have to enter department and team-leader
      if (this.isTeamLeader.value == true) {
        this.removeTeamLeaderAndDepartmentValidators();
      }
      else {
        this.setTeamLeaderAndDepartmentValidators();
      }
      //reset value of departmentId and teamLeaderId
      this.departmentId.setValue(null);
      this.teamLeaderId.setValue(null);
    }
    );
  }

  onSubmit() {
    let user: User = this.userFormGroup.value;
    let imageFile: string = this.imageFile;
    let data = { user, imageFile };
    this.dataEvent.emit(data);
  }


  // get image from event emitter of 'upload-image' component 
  //when user choose his profile image
  getImage(value: any) {
    this.imageFile = value;
  }

  setTeamLeaderAndDepartmentValidators() {
    this.teamLeaderId.setAsyncValidators(this.validatorsService.TeamLeaderValidator(this.user.teamLeaderId, this.user.userId, this.teamProjectIdList));
    this.teamLeaderId.setValidators(this.validatorsService.requiredValidator('team leader'));
    this.departmentId.setAsyncValidators(this.validatorsService.departmentValidator(this.user.departmentId, this.user.userId, this.teamProjectIdList));
    this.departmentId.setValidators(this.validatorsService.requiredValidator('department'));
  }
  removeTeamLeaderAndDepartmentValidators() {
    this.teamLeaderId.setAsyncValidators(null);
    this.teamLeaderId.setValidators(null);
    this.departmentId.setAsyncValidators(null);
    this.departmentId.setValidators(null);
  }

  //----------------GETTERS-------------------

  //getters of the form group controls

  get userName() {
    return this.userFormGroup.controls['userName'];
  }

  get email() {
    return this.userFormGroup.controls['email'];
  }

  get password() {
    return this.userFormGroup.controls['password'];
  }

  get confirmPassword() {
    return this.userFormGroup.controls['confirmPassword'];
  }

  get departmentId() {
    return this.userFormGroup.controls['departmentId'];
  }

  get teamLeaderId() {
    return this.userFormGroup.controls['teamLeaderId'];
  }

  get isTeamLeader() {
    return this.userFormGroup.controls['isTeamLeader'];
  }

}

