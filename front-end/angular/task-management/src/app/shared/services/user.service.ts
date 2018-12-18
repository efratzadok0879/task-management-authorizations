import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as sha256 from 'async-sha256';
import {
    MenuService,
    Login, User, eStatus, Email, ChangePassword,
    Global
} from '../../imports';
import { CustomHttpClient } from '../custom-http-client';

@Injectable()
export class UserService {

    //----------------PROPERTIRS-------------------

    basicURL: string = Global.HOST + `/user`;

    updateUserListSubject: Subject<void>;
    resetPermissionSubject: Subject<void>;

    //----------------CONSTRUCTOR------------------

    constructor(
        private http: CustomHttpClient,
        private httpClient: HttpClient,
        private router: Router,
        private menuService: MenuService) {

        this.updateUserListSubject = new Subject<void>();
        this.resetPermissionSubject = new Subject<void>();
    }

    //----------------METHODS-------------------

    //POST
    login(email: string, password: string): Observable<HttpResponse<User>> {
        let url: string = `${this.basicURL}/login`;
        let login = new Login(email, password);
        return this.httpClient.post<User>(url, login, { observe: 'response' });
    }

    //GET
    getAllUsers(): Observable<User[]> {
        let managerId: number = Global.CURRENT_USER.userId;
        let url: string = `${this.basicURL}/getAllUsers?managerId=${managerId}`;
        return this.http.get<User[]>(url);
    }

    //GET
    getAllTeamUsers(teamLeaderId: number): Observable<User[]> {
        let url: string = `${this.basicURL}/?teamLeaderId=${teamLeaderId}`;
        return this.http.get<User[]>(url);
    }

    //GET
    getAllTeamLeaders(): Observable<User[]> {
        let managerId: number = Global.CURRENT_USER.userId;
        let url: string = `${this.basicURL}/getAllTeamLeaders?managerId=${managerId}`;
        return this.http.get<User[]>(url);
    }

    //GET
    getUser(): Observable<User> {
        let url: string = `${this.basicURL}/getUser`;
        return this.http.get<User>(url);
    }
    //GET
    getUserById(userId: number): Observable<User> {
        let url: string = `${this.basicURL}/getUserById?userId=${userId}`;
        return this.http.get<User>(url);
    }

    //GET
    getUserByEmail(email: string): Observable<User> {
        let url: string = `${this.basicURL}/getUserByEmail?email=${email}`;
        return this.http.get<User>(url);
    }

    //POST
    addUser(user: User): Observable<boolean> {
        let url: string = `${this.basicURL}/addUser`;
        return this.http.post<boolean>(url, user);
    }

    //PUT
    editUser(user: User): Observable<boolean> {
        let url: string = `${this.basicURL}/editUser`;
        return this.http.put<boolean>(url, user);
    }

    //POST
    deleteUser(user: User): Observable<boolean> {
        //move user profile image to archives if exist
        if (user.profileImageName)
            this.removeUploadedImage(user.profileImageName, true).subscribe(() => { });
        let url: string = `${this.basicURL}/deleteUser?userId=${user.userId}`;
        return this.http.post<boolean>(url, null);
    }

    //POST
    uploadImageProfile(image: any): Observable<string> {
        let url: string = `${this.basicURL}/uploadImageProfile`;
        let formData: FormData = new FormData();
        formData.append('file', image, image.name);
        return this.http.post<string>(url, formData);
    }

    //POST
    removeUploadedImage(profileImageName: string, moveToArchives: boolean): Observable<boolean> {
        let url: string = `${this.basicURL}/removeUploadedImage`;
        let formData: FormData = new FormData();
        formData.append('profileImageName', profileImageName);
        formData.append('moveToArchives', String(moveToArchives));
        return this.http.post<boolean>(url, formData);
    }

    //POST
    sendEmail(email: Email): Observable<boolean> {
        let url: string = `${this.basicURL}/sendEmail`;
        let formData: FormData = new FormData();
        formData.append('email', JSON.stringify(email));
        formData.append('user', JSON.stringify(Global.CURRENT_USER));
        return this.http.post<boolean>(url, formData);
    }

    //POST
    checkUniqueValidations(user: User): Observable<{ val: string }> {
        let url: string = `${this.basicURL}/checkUniqueValidations`;
        return this.http.post<{ val: string }>(url, user);
    }

    //GET
    hasWorkers(teamLeaderId: number): Observable<boolean> {
        let url: string = `${this.basicURL}/hasWorkers?teamLeaderId=${teamLeaderId}`;
        return this.http.get<boolean>(url);
    }

    //POST
    forgotPassword(email: string): Observable<boolean> {
        let url: string = `${this.basicURL}/forgotPassword?email=${email}`;
        return this.http.post<boolean>(url, null);
    }

    //POST
    confirmToken(changePassword: ChangePassword): Observable<boolean> {
        let url: string = `${this.basicURL}/confirmToken`;
        return this.http.post<boolean>(url, changePassword);
    }

    //POST
    changePassword(user: User): Observable<boolean> {
        let url: string = `${this.basicURL}/changePassword`;
        return this.http.put<boolean>(url, user);
    }

    logout() {
        // remove user from global and local storage to log user out
        Global.CURRENT_USER = null;
        localStorage.removeItem(Global.TOKEN);
        this.menuService.setMenu(null);
    }

    async initCurrentUser(): Promise<boolean> {
        if (!Global.CURRENT_USER) {
            try {
                let user: User = (await this.getUser().toPromise());
                Global.CURRENT_USER = user;
                this.initUserStatus();
                return true;
            }
            catch{
                localStorage.removeItem(Global.TOKEN);
                return false;
            }
        }
        else {
            return Promise.resolve(null).then(() => { return true; });
        }
    }

    initUserStatus() {
        let user: User = Global.CURRENT_USER;
        let status: eStatus;
        if (user.managerId == null) {
            status = eStatus.MANAGER;
        }
        else
            if (user.teamLeaderId == null) {
                status = eStatus.TEAM_LEADER;
            }
            else {
                status = eStatus.WORKER;
            }
        Global.STATUS = status;
    }

    async navigateByStatus() {
        if (localStorage.getItem(Global.TOKEN) == null) {
            localStorage.removeItem(Global.TOKEN);
            this.router.navigate(['taskManagement/login']);
            return;
        }
        await this.initCurrentUser();
        if (Global.CURRENT_USER) {
            let status: eStatus = Global.STATUS;
            if (status == eStatus.MANAGER) {
                this.router.navigate(['taskManagement/main/manager/userManagement']);
            }
            else {
                if (status == eStatus.TEAM_LEADER) {
                    this.router.navigate(['taskManagement/main/teamLeader/workerHoursManagement/projectHoursList']);
                }
                else//status == eStatus.WORKER 
                {
                    this.router.navigate(['taskManagement/main/worker/home']);
                }
            }

        }
        else {
            localStorage.removeItem(Global.TOKEN);
            this.router.navigate(['taskManagement/login']);
        }
    }

    async hashValue(val: string) {
        let hashVal = await sha256(val);
        return hashVal;
    }

}