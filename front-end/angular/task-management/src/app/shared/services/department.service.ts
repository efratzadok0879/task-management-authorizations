import { Injectable } from '@angular/core';
import { Department,Global,CustomHttpClient } from '../../imports';

@Injectable()
export class DepartmentService {
    
    //----------------PROPERTIRS-------------------

    basicURL: string = Global.HOST + `/department`;

    //----------------CONSTRUCTOR------------------

    constructor(private http: CustomHttpClient) { }

    //----------------METHODS-------------------
    
    //GET
    getAllDepartments(): Promise<Department[]> {
        let url: string = `${this.basicURL}/getAllDepartments`;
        return this.http.get<Department[]>(url).toPromise();
    }

}