import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from '../imports';
import { Observable } from 'rxjs';

@Injectable()
export class CustomHttpClient {

    constructor(private http: HttpClient) { }

    createAuthorizationHeader(): { headers: HttpHeaders } {
        let httpOptions = {
            headers: new HttpHeaders({
                'token': localStorage.getItem(Global.TOKEN)
            })
        };
        return httpOptions;
    }

    get<T>(url): Observable<T> {
        return this.http.get<T>(url, this.createAuthorizationHeader());
    }

    post<T>(url, data): Observable<T> {
        return this.http.post<T>(url, data,this.createAuthorizationHeader());
    }

    put<T>(url, data): Observable<T> {
        return this.http.put<T>(url, data,this.createAuthorizationHeader());
    }
}