import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService, eStatus, Global } from '../imports';

@Injectable()
export class AuthGuard implements CanActivate {

    //----------------CONSTRUCTOR------------------

    constructor(private userService: UserService) { }

    //----------------METHODS-------------------

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        
        if (state.url == '/' || state.url == '/taskManagement/login') {
            let token: string = localStorage.getItem(Global.TOKEN);
            if (token == null) {
                return true;
            }
            await this.userService.navigateByStatus();
            return false;
        }
       
        let status: eStatus = Global.STATUS;
        
        if (route.url[0].path == 'manager') {
            if (status == eStatus.MANAGER) {
                return await this.userService.initCurrentUser();
            }
            await this.userService.navigateByStatus();
            return false;
        }
        
        if (route.url[0].path == 'teamLeader') {
            if (status == eStatus.TEAM_LEADER) {
                return await this.userService.initCurrentUser();
            }
            await this.userService.navigateByStatus();
            return false;
        }
        
        if (route.url[0].path == 'worker') {
            if (status == eStatus.WORKER) {
                return await this.userService.initCurrentUser();
            }
            await this.userService.navigateByStatus();
            return false;
        }
    }
    
    

}