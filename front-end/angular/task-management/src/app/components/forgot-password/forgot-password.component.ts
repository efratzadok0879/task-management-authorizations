import { Component } from '@angular/core';
import swal from 'sweetalert2'
import { UserService,User,ChangePassword } from '../../imports';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  user: User;
  count: number;

  constructor(private userService: UserService) {
  }

  async forgotPassword() {
    this.count = 0;
    await swal.mixin({
      title: 'Forgot Password?',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3']
    }).queue([
      //forgot password dialog
      {
        text: 'We\'ll help you get another one!',
        input: 'email',
        inputPlaceholder: 'enter your email',
        showLoaderOnConfirm: true,
        preConfirm: async (value: string) => {
          this.user = await this.userService.getUserByEmail(value).toPromise();
          if (this.user == null) {
            swal.showValidationMessage(
              'email not found'
            )
          }
          else {
            let isExist: boolean = await this.userService.forgotPassword(value).toPromise();
            if (!isExist) {
              swal.showValidationMessage(
                'Sorry,For safety reasons, you can only try to recover your password in 10 minutes'
              )
            }
          }
        }
      },
      //verify acount dialog
      {
        text: 'Verify your account, you got a verification code to your email',
        input: 'number',
        inputPlaceholder: 'verification code you got to your email',
        showLoaderOnConfirm: true,
        preConfirm: async (value: string) => {
          if (this.count == 3) {
            swal.showValidationMessage(
              'Sorry,For safety reasons, you can only try to recover your password in 10 minutes'
            );
            return;
          }
          this.count++;
          let changePassword: ChangePassword = new ChangePassword(this.user.userId, value, null, this.count);
          let confirmed: boolean = await this.userService.confirmToken(changePassword).toPromise();
          if (!confirmed) {
            swal.showValidationMessage(
              'Sorry, token is missed!'
            );
          }
        }
      },
      //change password dialog
      {
        text: 'choose your new password',
        html:
          '<input id="password" class="swal2-input" type="password" placeholder="enter your new password">' +
          '<input id="confirmPassword" class="swal2-input" type="password" placeholder="confirm your new password">',
        preConfirm: async () => {
          let password: string = (document.getElementById('password') as HTMLInputElement).value;
          let confirmPassword: string = (document.getElementById('confirmPassword') as HTMLInputElement).value;
          if (password != confirmPassword) {
            swal.showValidationMessage(
              'password and confirm password don\'t match'
            );
          }
          else {
            let hashPassword: string = await this.userService.hashValue(password);
            this.user.password = this.user.confirmPassword = hashPassword;
            try {
              await this.userService.changePassword(this.user).toPromise();
              swal.close();
            }
            catch (err) {
              swal.showValidationMessage(
                err.error[0]
              );
            }
          }
        }
      },
    ]).then((result) => {
      if (result.value) {
        swal({
          type: 'success',
          title: 'Password changed successfully!',
        })
      }
    });
  }

}
