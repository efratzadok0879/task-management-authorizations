import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Permission,Global ,CustomHttpClient} from '../../imports';

@Injectable()
export class PermissionService {
    
    //----------------PROPERTIRS-------------------

    basicURL: string = Global.HOST + `/permission`;
    deletePermissionSubject:Subject<Permission>;
    addPermissionSubject:Subject<Permission>;
    
    //----------------CONSTRUCTOR------------------

    constructor(private http: CustomHttpClient) {
        this.deletePermissionSubject=new Subject<Permission>();
        this.addPermissionSubject=new Subject<Permission>();
    }

    //----------------METHODS-------------------

    //POST
    addPermission(permission:Permission): Observable<number> {
        let url: string = `${this.basicURL}/addPermission`;
        return this.http.post<number>(url,permission);
    }

    //POST
    deletePermission(permissionId:number): Observable<boolean> {
        let url: string = `${this.basicURL}/deletePermission?permissionId=${permissionId}`;
        return this.http.post<boolean>(url, null);
    }
    
}