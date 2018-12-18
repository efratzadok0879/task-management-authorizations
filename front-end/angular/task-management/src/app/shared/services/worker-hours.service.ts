import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WorkerHours, Global, CustomHttpClient } from '../../imports';

@Injectable()
export class WorkerHoursService {

    //----------------PROPERTIRS-------------------

    basicURL: string = Global.HOST + `/workerHours`;

    changeWorkerHoursSubject: Subject<WorkerHours>;
    deleteWorkerHoursSubject: Subject<WorkerHours>;
    addWorkerHoursSubject: Subject<WorkerHours>;

    //----------------CONSTRUCTOR------------------

    constructor(private http: CustomHttpClient) {
        this.changeWorkerHoursSubject = new Subject<WorkerHours>();
        this.deleteWorkerHoursSubject = new Subject<WorkerHours>();
        this.addWorkerHoursSubject = new Subject<WorkerHours>();
    }

    //----------------METHODS-------------------

    //GET
    getAllWorkerHours(workerId: number): Observable<WorkerHours[]> {
        let url: string = `${this.basicURL}/getAllWorkerHours?workerId=${workerId}`;
        return this.http.get<WorkerHours[]>(url);
    }

    //PUT
    editWorkerHours(workerHours: WorkerHours): Observable<boolean> {
        let url: string = `${this.basicURL}/editWorkerHours`;
        return this.http.put<boolean>(url, workerHours);
    }

    //POST
    hasUncomletedHours(workerId: number, projectIdList: number[]): Observable<boolean> {
        let url: string = `${this.basicURL}/hasUncomletedHours`;
        let formData: FormData = new FormData()
        formData.append('workerId', workerId.toString());
        formData.append('projectIdList', JSON.stringify(projectIdList));
        return this.http.post<boolean>(url, formData);
    }

}
