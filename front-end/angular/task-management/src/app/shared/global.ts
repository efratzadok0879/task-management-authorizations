import { environment } from '../../environments/environment';
import { User } from '../imports';
import { eStatus } from './models/help/e-status.model';

export class Global {
    //base endpoint for user management RESTful APIs
    //for c#
    public static HOST: string = `${environment.host}/api`;
    public static UERS_PROFILES: string = `${environment.host}/Images/UsersProfiles`;

    //for php
    // public static HOST: string = `${environment.host}/index.php`;
    // public static UERS_PROFILES: string = `${environment.host}/images/users-profiles`;

    public static TOKEN: string = 'token';
    
    public static STATUS: eStatus;
    public static CURRENT_USER: User;

}