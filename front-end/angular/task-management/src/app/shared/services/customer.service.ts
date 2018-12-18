import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer,Global, CustomHttpClient } from '../../imports';

@Injectable()
export class CustomerService {
    
    //----------------PROPERTIRS-------------------

    basicURL: string = Global.HOST + `/customer`;

    //----------------CONSTRUCTOR------------------

    constructor(private http: CustomHttpClient) { }

    //----------------METHODS-------------------
    
    //GET
    getAllCustomers(): Observable<Customer[]> {
        let url: string = `${this.basicURL}/getAllCustomers`;
        return this.http.get<Customer[]>(url);
    }


}
