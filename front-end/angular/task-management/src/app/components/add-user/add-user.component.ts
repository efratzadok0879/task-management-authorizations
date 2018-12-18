import { Component, } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { UserService, User, Global } from '../../imports';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})

export class AddUserComponent {

  //----------------PROPERTIRS-------------------

  user: User
  caption: string;

  //----------------CONSTRUCTOR------------------

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.user = new User(0, '', '', '', '', null, null,null,null);
    this.caption = 'Add User';
  }

  //----------------METHODS-------------------

  onSubmit(data: { user: User, imageFile: string }) {
    this.user = data.user;

    //upload profile image in the server
    if (data.imageFile) {
      this.userService.uploadImageProfile(data.imageFile)
        .subscribe((newFilename: string) => {
          
          //insert image name to the user object
          this.user.profileImageName = newFilename;
          this.addUser();
        });
    }
    else
      this.addUser();
  }

  async addUser() {
    this.user.password = this.user.confirmPassword = await this.userService.hashValue(this.user.password);
    this.user.managerId = Global.CURRENT_USER.userId;
    this.userService.addUser(this.user).subscribe(
      (created:boolean) => {
        if (created) {
          swal({
            type: 'success',
            title: `${this.user.userName} added succsesully`,
          }).then(() => {
            this.router.navigate(['taskManagement/main/manager/userManagement']);
          });

        }
      },
      err => console.log(err));
  }
 
}