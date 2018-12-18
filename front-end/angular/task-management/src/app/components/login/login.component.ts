import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  UserService, ValidatorsService,
  User, eStatus,
  Global
} from '../../imports';
import { HttpResponse } from '@angular/common/http';
import { stream } from 'xlsx/types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./../../../form-style.css', './login.component.css']
})
export class LoginComponent {

  //----------------PROPERTIRS-------------------

  loginFormGroup: FormGroup;
  isExistUser: boolean;
  hashPassword: string;

  //allow access 'Object' type via interpolation
  objectHolder: typeof Object = Object;

  //----------------CONSTRUCTOR------------------

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private validatorsService: ValidatorsService,
  ) {
    this.isExistUser = true;
    this.initFormGroup();
  }

  //----------------METHODS-------------------

  initFormGroup() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', this.validatorsService.stringValidatorArr('email', 15, 30, /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      password: ['', this.validatorsService.stringValidatorArr('password', 5, 10, /^[A-Za-z0-9]+$/)]
    });
  }

  async onSubmit() {
    this.hashPassword = await this.userService.hashValue(this.password.value);
    this.login();
  }

  login() {
    this.userService.login(this.email.value, this.hashPassword)
      .subscribe(
        (res: HttpResponse<any>) => {

          //enter user object to Global
          let user = res.body;
          Global.CURRENT_USER = user;

          //enter token to local-storage
          //this token will send in header to every methods for authentication and authorization
          let token: string = res.headers.get('token');
          localStorage.setItem(Global.TOKEN, token);

          //enter user status to Global
          this.userService.initUserStatus();

          //navigate to the suitable screen
          this.userService.navigateByStatus();

        },
        err => {
          //if user is not found
          if (err.status == 404)
            this.isExistUser = false;
          console.log(err);
        });
  }

  removeValidationMassage() {
    this.isExistUser = true;

  }

  //----------------GETTERS-------------------

  //getters of the form group controls

  get email() {
    return this.loginFormGroup.controls['email'];
  }
  get password() {
    return this.loginFormGroup.controls['password'];
  }
}
